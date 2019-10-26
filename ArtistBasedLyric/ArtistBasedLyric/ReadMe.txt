The project can open in jupyter notebook.

This project attempts to create a model to classify song lyrics by artist. 
It uses a Multinomial Naive Bayes approach, where songs are treated as unordered 
collections of words. A variance threshold is applied in order to remove words 
that have low variance across artists from the corpus. The value of the variance 
threshold is determined by trying many values and calculating the accuracy 
using each one, and selecting the appropriate value. 
TFIDF (Term Frequency Inverse Document Frequency) is used to weight word counts
such that words that are used less commonly used are weighed stronger.
The average accuracy achieved with this method is approximately 0.65~0.70