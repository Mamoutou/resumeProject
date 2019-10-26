import math
import operator

def main():
    # build a model and testing it with traindata and testdata 
    # Train
    train_messages, vocab, train_features, train_labels = preprocess(
        "traindata.txt", "trainlabels.txt")
    model = train(train_messages, vocab, train_features, train_labels)	
    
	#############################################################
	# Testing on train data 
    print ("Testing on train data set (accuracy be should > 90%) ...........")	
    test_messages, test_features, test_labels = preprocess(
        "traindata.txt", "trainlabels.txt", vocab)
    test(model, test_features, test_labels)
    print("=======================================================================================")
    
    # Testing on test data  
    print ("Testing on test data")  
    test_messages, test_features, test_labels = preprocess(
        "testdata.txt", "testlabels.txt", vocab)
    test(model, test_features, test_labels)
    
class NaiveBayesModel: 
    #Naive Bayes probability model. Remove stop words eg:(a,about,above after ... ) 
    features = []
    labels = []
    messages = []
    vocab = []
    
    def __init__(self, vocab):
        self.vocab = vocab

    def label_probability_cal(self, feature, check_label):
        
        # Compute P(Class=label) = len(Class=label) / len(Classes)
        num_of_label = 0
        num_total_labels = len(self.labels)
        for past_label in self.labels:
            if past_label == check_label: 
               num_of_label += 1

        # Laplace smoothing 
        p_label = (num_of_label + 1) / (num_total_labels + 1)

        print("\tP(Class=" + str(check_label) + ")=" +
              str(p_label) + " (" + str(num_of_label) + "/" +
              str(num_total_labels) + ")")
        
        count_w_and_c = [0 for x in range(len(self.vocab))]
        # Go through past feature vectors of same class and
        # count up occurences of x_i = feature_i
        for i in range(len(self.features)):
            f = self.features[i]
            l = self.labels[i]
            if l == check_label:
                # Go through words in each vector
                for j in range(len(f)):
                    if f[j] == feature[j]: count_w_and_c[j] += 1
        p_product = 1
        i = 0
        for c in count_w_and_c:
            # Laplace smoothing for binomial case
            prob_w_c = (c + 1) / (num_of_label + 1)            
            p_product *= prob_w_c   
        return p_label * p_product

    def predict(self, feature, label, is_testing=True):   
        #Predict class as 0 or 1
        
        # Determine P(Class=0 | x_1,...,x_m)  
        label_0_prob = self.label_probability_cal(feature, 0)
        # Determine P(Class=1 | x_1,...,x_m) 
        label_1_prob = self.label_probability_cal(feature, 1)

        print("\tlabel_0_probability = " + str(label_0_prob) +
              "\n\tlabel_1_probability = " + str(label_1_prob))

        # choose label with max probability
        pred_label = 0
        if (label_1_prob > label_0_prob): pred_label = 1
        print("\tActual label = " + str(label) + ", predicted label = " +
              str(pred_label))

        if is_testing is True:
            # Add this example to model's seen data, used for future
            # predictions
            self.features.append(feature)
            self.labels.append(label)
        print()      
        return pred_label

   

def preprocess(data_loc, label_loc, extern_vocab=None):   
    #Converts messages into features and returns list of these messages,
    #vocabulary, feature vectors, and training labels

    print("Preprocesing data...")

    # Location of stop words
    stop_list_loc = "stopping_words.txt"

    # Get data into memory as list of lines
    with open(data_loc, 'r') as file:
        data_raw = file.read().splitlines()
    with open(label_loc, 'r') as file:
        labels_raw = file.read().splitlines()
    with open(stop_list_loc, 'r') as file:
        stop_list_raw = file.read().splitlines()

    # Parse stop words into unique set
    stop_words = set()
    for line in stop_list_raw:
        word = line.lower()
        stop_words.add(word)

    # If vocabulary provided, use that; otherwise,
    # get train (message) words into unique set,
    # ensuring not to add stop words, and convert
    # then to sorted list
    
    vocab = set()
    if extern_vocab is None:
        for line in data_raw:
            words = line.lower().split()
            for word in words:
                if word not in stop_words : #stop_words:
                    vocab.add(word)
        sorted_vocab = sorted(vocab)
    else: vocab = extern_vocab

    # Turn each class label to int (e.g. '0' to 0, '1' to 1)
    labels = list(map(int, labels_raw))

    # Mark which vocab words appeared in each message
    feature_sets = []
    for message in data_raw:
        message_words = dict.fromkeys(vocab, 0)
        words = message.lower().split()
        for word in words:
            if word in message_words:
                message_words[word] = 1
        feature_sets.append(message_words)

    # Turn feature sets into feature vectors (sorted alphebetically)
    features = []
    for feature in feature_sets:
        sorted_set = sorted(feature.items(), key=operator.itemgetter(0))
        sorted_set_occ = [x[1] for x in sorted_set]
        features.append(sorted_set_occ)

    # Return different things, depending on if we've been given
    # an external vocabulary
    if extern_vocab is None:
        return data_raw, sorted_vocab, features, labels
    else: return data_raw, features, labels
        
def train(messages, vocab, features, labels):
    
    print("Training Naive Bayes classifier on data using the traindata ...............")

    # Initialize our probability model with vocabulary
    model = NaiveBayesModel(vocab)

    # Collect accuracy
    num_mistakes = 0
    num_features = len(features)

    # Train on each feature, sequentially
    for i in range(len(messages)):
        message = messages[i]
        feature = features[i]
        label = labels[i]
        print("\t(" + str(i + 1) + ") '" + str(message) + "'")
        pred_label = model.predict(feature, label)
    return model

def test(model, features, labels):
    print("Testing model accuracy.............")
    # Collect stats
    num_mistakes = 0
    num_features = len(features)
    # Train on each feature, sequentially
    for i in range(num_features):
        feature = features[i]
        label = labels[i]
        pred_label = model.predict(feature, label, True)
        if (pred_label != label):
            num_mistakes += 1
    test_accuracy = (1 - (num_mistakes / num_features)) * 100
    print("\n" + "Testing completed with accuracy is:  = %0.2f%%" % test_accuracy)
    
if __name__ == "__main__": 
     main()

