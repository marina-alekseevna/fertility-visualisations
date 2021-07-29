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

    childless = df[df.variable != "childless"]
    childless.to_csv("./data/childless.csv")

    df = (
        df[(df.variable != "final") & (df.variable != "childless")]
        .dropna()
        .sort_values(by=["year", "variable"], ascending=[False, True])
        .reset_index(drop=True)
    )

    if file_path == "./data/cohort.csv":
        df.value = df.value * 100

    count_series = df.value_counts(["year"])
    count_df = count_series.to_frame("count").reset_index()

    df = pd.merge(df, count_df, on="year")
    df.to_csv(file_path[0:-4] + "_2d.csv", index=False)


# In[31]:


fertility_files = ["./data/cohort.csv", "./data/cohort_total.csv"]
for file in fertility_files:
    preprocess_fertility(file)


# In[29]:


df = pd.read_csv("./data/numchildren_percentages.csv")

# Cleanup
df = df.fillna(method="ffill")
df = df.dropna().reset_index(drop=True)
df = df[df.age != "Final3"]


df["zero"] = df["0"] / df["Total"]
df["one"] = df["1"] / df["Total"]
df["two"] = df["2"] / df["Total"]
df["three"] = df["3"] / df["Total"]
df["four"] = df["4"] / df["Total"]
df = df[["year", "age", "zero", "one", "two", "three", "four"]]


# In[271]:


df[["year", "age", "zero", "one", "two", "three", "four"]].to_csv(
    "./data/numchildren_percentages_normalised.csv", index=False
)
df3 = df[["year", "age", "one", "two", "three", "four"]]
df3["Total"] = df3["one"] + df3["two"] + df3["three"] + df3["four"]
df3["one"] = df3["one"] / df3["Total"]
df3["two"] = df3["two"] / df3["Total"]
df3["three"] = df3["three"] / df3["Total"]
df3["four"] = df3["four"] / df3["Total"]
df3["year"] = df3["year"] + pd.to_numeric(df3["age"], downcast="integer")
df3[["year", "age", "one", "two", "three", "four"]].to_csv(
    "./data/filtered_numchildren_percentages_normalised.csv", index=False
)


# In[288]:


df["year"] = df["year"] + pd.to_numeric(df["age"], downcast="integer")


# In[289]:


pd.melt(df, id_vars=["year", "age"]).to_csv("./data/numchildren_2d.csv", index=False)
