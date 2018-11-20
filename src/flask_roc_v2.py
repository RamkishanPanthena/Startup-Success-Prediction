import pandas as pd
import numpy as np
from sklearn.metrics import roc_curve
from sklearn import metrics
from flask_cors import CORS
import simplejson as json
from flask import Flask, stream_with_context
from sklearn.cross_validation import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from io import StringIO
from werkzeug.datastructures import Headers
from werkzeug.wrappers import Response
import csv
from sklearn.tree import DecisionTreeClassifier

app = Flask(__name__)
CORS(app)

@app.route('/roc_curve/m=<m>/d=<d>/l=<l>/n=<n>/c=<c>', methods=['GET'])
def roc_curve(m,d,l,n,c):
    if m == "model1":
        model = GradientBoostingClassifier(criterion = 'mae', learning_rate = float(c),
                                      loss = 'deviance', max_depth = int(d),
                                      max_features = 'log2', max_leaf_nodes = int(l),
                                      n_estimators = int(n))
    elif m == "model2":        
        model = RandomForestClassifier(criterion = 'entropy', max_depth = int(d), 
                                       max_features = 'sqrt', max_leaf_nodes = int(l),
                                       n_estimators = int(n))
    else:
        model = DecisionTreeClassifier(max_depth = int(d),
                                       max_leaf_nodes = int(l))
    
    print("Roc",m,d,l,n,c)
    classifier = model.fit(X_train, y_train)
    print(model)
    y_pred = classifier.predict_proba(X_test)
    fpr, tpr, thresholds = metrics.roc_curve(y_test,y_pred[:,1],pos_label=1)
    result=[]
    for i in range(len(fpr)):
        result.append({"fpr":fpr[i],"tpr":tpr[i]})
    return json.dumps(result)

@app.route('/viz/m=<m>/d=<d>/l=<l>/n=<n>/c=<c>', methods=['GET'])
def viz(m,d,l,n,c):
    if m == "model1":
        model = GradientBoostingClassifier(criterion = 'mae', learning_rate = float(c),
                                      loss = 'deviance', max_depth = int(d),
                                      max_features = 'log2', max_leaf_nodes = int(l),
                                      n_estimators = int(n))
    elif m == "model2":        
        model = RandomForestClassifier(criterion = 'entropy', max_depth = int(d), 
                                       max_features = None, max_leaf_nodes = int(l),
                                       n_estimators = int(n))
    else:
        model = DecisionTreeClassifier(max_depth = int(d),
                                       max_leaf_nodes = int(l))
    
    print("Viz",m,d,l,n,c)
    
    classifier = model.fit(X_train, y_train)
    print(model)
    X_new = test_df[features].values
    
    test_df['prob_acquired'] = classifier.predict_proba(X_new)[:,1]
    test_df['acquired'] = np.where(test_df['prob_acquired']>=0.5, 1, 0)
    test_df['closed'] = np.where(test_df['prob_acquired']<0.5, 1, 0)    
    
    q1 = pd.merge(states_df, test_df, left_on = 'State', right_on = 'state', how = 'left')
    
    ren_col = {'prob_acquired': 'mean_prob_companies_acquired_by_state',
               'acquired': 'count_prob_companies_acquired_by_state',
               'closed': 'count_prob_companies_closed_by_state'}
    output_df = q1.groupby('State').agg({'prob_acquired': 'mean', 
                             'acquired': 'sum',
                             'closed': 'sum'}).rename(columns = ren_col)
    output_df = output_df.reset_index()
    
    output_df.loc[output_df['mean_prob_companies_acquired_by_state'].isnull(), 'mean_prob_companies_acquired_by_state'] = 0
    output_df.loc[output_df['count_prob_companies_acquired_by_state'].isnull(), 'count_prob_companies_acquired_by_state'] = 0
    output_df.loc[output_df['count_prob_companies_closed_by_state'].isnull(), 'count_prob_companies_closed_by_state'] = 0
    
    def generate(output_df):
        d = StringIO()
        w = csv.writer(d)
        
        #write header
        w.writerow(tuple(output_df.columns))
        yield d.getvalue()
        d.seek(0)
        d.truncate(0)
        
        for i in range(output_df.shape[0]):
            w.writerow(tuple(output_df.iloc[i].values))
            yield d.getvalue()
            d.seek(0)
            d.truncate(0)
        
    # add a filename
    headers = Headers()
    headers.set('Content-Disposition', 'attachment', filename='log.csv')

    # stream the response as the data is generated
    return Response(
        stream_with_context(generate(output_df)),
        mimetype='text/csv', headers=headers
    )


train_df = pd.read_csv('../d3/data/train-data.csv', encoding = 'utf-8')
test_df = pd.read_csv('../d3/data/test-data.csv', encoding = 'utf-8')
states_df = pd.read_csv('../d3/data/states.csv', encoding = 'utf-8')

features = ['age_first_funding_year', 'age_last_funding_year', 'relationships',
             'funding_total_usd', 'milestones', 'is_CA', 'is_NY', 'is_MA', 'is_TX', 
             'is_otherstate', 'is_software', 'is_web', 'is_mobile', 'is_enterprise', 
             'is_advertising', 'is_gamesvideo', 'is_ecommerce', 'is_biotech', 
             'is_consulting', 'is_othercategory', 'has_VC', 'has_angel', 'has_roundA',
             'has_roundB', 'has_roundC', 'has_roundD', 'avg_participants', 
             'is_top500','funding_rounds']
data = train_df[features + ['labels']].values
               
X = data[:,:-1]
y = data[:,29]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.3, random_state = 0)

app.run(debug = True)