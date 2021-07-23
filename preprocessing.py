#!/usr/bin/env python
# coding: utf-8

# In[2]:


import pandas as pd
import json
import csv


# In[30]:


def preprocess_fertility(file_path):
    df = pd.read_csv(file_path, index_col=False)
    df = pd.melt(df, id_vars=["year"])
    
    childless = df[df.variable!="childless"]
    childless.to_csv("./data/childless.csv")
    
    df = df[(df.variable!="final") & (df.variable!="childless")].dropna().sort_values(by=["year","variable"], ascending=[False, True]).reset_index(drop=True)
    
    if (file_path=='./data/cohort.csv'):
        df.value = df.value * 100
    
    count_series = df.value_counts(["year"])
    count_df = count_series.to_frame("count").reset_index()
    
    df = pd.merge(df, count_df, on="year")
    df.to_csv(file_path[0:-4]+"_2d.csv", index=False)


# In[31]:


fertility_files = ['./data/cohort.csv', './data/cohort_total.csv']
for file in fertility_files:
    preprocess_fertility(file);


# In[29]:


fertility_files[0][0:-4]


# In[24]:


df2 = pd.read_csv(, index_col=False)
df2 = pd.melt(df, id_vars=["year"])
df2 = df[(df.variable!="final")].dropna().sort_values(by=["year","variable"], ascending=[False, True]).reset_index(drop=True)
df2.to_csv("./data/cohort_total_2d.csv", index=False)
max(df2.value)


# In[23]:





# In[89]:


with open('./data/cohort.csv') as f:
    reader = csv.reader(f)
    rows = list(reader)


# In[90]:


rows 


# In[85]:


with open('./json/cohort.json', 'w') as f:
    json.dump(rows, f)


# In[64]:


rows


# In[17]:


import os


# In[ ]:





# In[43]:


len(rows)


# In[61]:


file_list = os.listdir("./data/pyramid/")
file_list.sort()


# In[62]:



pyramid = []
for file in file_list:
    with open(f'./data/pyramid/{file}') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
#         print(rows)
        for row in rows:
#             row.update({"Year":int(file[-8:-4])})
            row["M"] = int(row["M"])
            row["F"] = int(row["F"])
        pyramid.append({"Year":int(file[0:4]), "Cohorts":rows})
            
print(pyramid)

with open('./json/pyramid.json', 'w') as f:
    json.dump(rows, f)


# In[93]:


df = pd.read_csv("./data/numchildren.csv").drop(columns="Total")
df = pd.melt(df, id_vars=["mothersdob", "age"])
df.to_csv("./data/numchildren.csv", index=False)

