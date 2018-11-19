# Startup-Success-Prediction

Startups play a major role in economic growth. They bring new ideas, spur innovation, create employment thereby moving the economy. There has been an exponential growth in startups over the past few years. Predicting the success of a startup allows investors to find companies that have the potential for rapid growth, thereby allowing them to be one step ahead of competition.

## Motivation

GMO being an investment management firm is committed to delivering superior investment advice to their clients that are interested in investing in startups. Thus, being able to predict the success of a startup will help GMO to be of greater value to their customers. 

### Objective

The objective of the project is to predict whether a startup which is currently operating turn into a success or a failure. The success of a company is defined as the event that gives the company's founders a large sum of money through the process of M&A (Merger and Acquisition) or an IPO (Initial Public Offering). A company would be considered as failed if it had to be shutdown. 

This problem will be solved through a Supervised Machine Learning approach by training a model based on the history of startups which were either acquired or closed. The trained model will then be used to make predictions on startups which are currently operating to determine their success/failure. The final predictions of startup success/failure would then be visualized on a US map by grouping the startup prediction probabilities by state. Thus, states having higher mean prediction probabilities will be have higher percentage of successful startups as compared to states with lower mean prediction probabilities. Each state will also have a diverging color scale based on their mean prediction probabilities. The user can interactively hover over each state to get additional information about them.

## Data

### Summary

GMO has acquired data from another vendor on a trial basis. The data contains industry trends, investment insights and individual company information. Since the data was acquired on a trial basis, it only contains information about companies known till 2012. For this project, only the data of companies operating between 2005 and 2012 has been used. The train/test data contains all companies that were either acquired/closed (used a labels) within that time frame. After training the model, we predict whether startups still operating in the same time frame would be acquired/closed.

### Data types

There are 49 columns out of which 31 will be used as features. The rest provide more information about the data, but will not be used for model training (like company name, company id, latitude, longitude, zip code etc.)

Some of the top features include:
* age_first_funding_year – quantitative
* age_last_funding_year – quantitative
* relationships – quantitative
* funding_rounds – quantitative
* funding_total_usd – quantitative
* milestones – quantitative
* age_first_milestone_year –  quantitative
* age_last_milestone_year – quantitative
* state – categorical
* industry_type – categorical
* has_VC – categorical
* has_angel – categorical
* has_roundA – categorical
* has_roundB – categorical
* has_roundC – categorical
* has_roundD – categorical
* avg_participants – quantitative
* is_top500 – categorical
* status(acquired/closed) – categorical

### Data pre-processing, preliminary insights and plots

#### **Visualization #1**

From the Correlograms, we can see that there isn’t a very high correlation between the individual features. Thus, most of the features are unique and can be used for training the model.

![corr](https://user-images.githubusercontent.com/29097566/48717478-7f44fb00-ebe7-11e8-8d93-4f2d6ea1c5b2.png)

#### **Visualization #2**

Sankey diagram visualizing number of key relationships a company has to its success/failure. We can see that companies with fewer relationships are more likely to fail as compared to companies with more relationships.

![sankey1](https://user-images.githubusercontent.com/29097566/48718347-342be780-ebe9-11e8-97c6-4f829c6b6a05.JPG)

#### **Visualization #3**

Another sankey diagram showing a similar relationship between number of company milestones and its success/failure.

![sankey2](https://user-images.githubusercontent.com/29097566/48718422-5b82b480-ebe9-11e8-8ce3-d4f19ecdfa0b.JPG)

#### **Visualization #4**

Scatter plot of the total funding a company received to the amount spent on acquiring that company. Companies that have been closed with have an acquisition amount of 0. We can see that there is a positive correlation between the two.

![scatter](https://user-images.githubusercontent.com/29097566/48718553-9f75b980-ebe9-11e8-95b8-d1449da43173.png)

## Task Analysis



[![Alt text](https://img.youtube.com/vi/lLWEXRAnQd0/0.jpg)](https://www.youtube.com/watch?v=lLWEXRAnQd0)
