
// AI Model Implementation - Version 2321
class NeuralNetwork {
  constructor(inputNodes, hiddenNodes, outputNodes) {
    this.inputNodes = inputNodes;
    this.hiddenNodes = hiddenNodes;
    this.outputNodes = outputNodes;
    this.learningRate = 0.1;
    
    this.weightsInputHidden = Matrix.randomize(this.hiddenNodes, this.inputNodes);
    this.weightsHiddenOutput = Matrix.randomize(this.outputNodes, this.hiddenNodes);
    
    this.biasHidden = Matrix.randomize(this.hiddenNodes, 1);
    this.biasOutput = Matrix.randomize(this.outputNodes, 1);
  }

  feedforward(inputArray) {
    let inputs = Matrix.fromArray(inputArray);
    let hidden = Matrix.multiply(this.weightsInputHidden, inputs);
    hidden.add(this.biasHidden);
    hidden.map(sigmoid);
    
    let output = Matrix.multiply(this.weightsHiddenOutput, hidden);
    output.add(this.biasOutput);
    output.map(sigmoid);
    
    return output.toArray();
  }

  train(inputArray, targetArray) {
    // Feedforward
    let inputs = Matrix.fromArray(inputArray);
    let hidden = Matrix.multiply(this.weightsInputHidden, inputs);
    hidden.add(this.biasHidden);
    hidden.map(sigmoid);
    
    let outputs = Matrix.multiply(this.weightsHiddenOutput, hidden);
    outputs.add(this.biasOutput);
    outputs.map(sigmoid);

    // Convert array to matrix object
    let targets = Matrix.fromArray(targetArray);

    // Calculate the error
    let outputErrors = Matrix.subtract(targets, outputs);

    // Calculate gradient
    let gradients = Matrix.map(outputs, dsigmoid);
    gradients.multiply(outputErrors);
    gradients.multiply(this.learningRate);

    // Calculate deltas
    let hiddenTranspose = Matrix.transpose(hidden);
    let weightHiddenOutputDeltas = Matrix.multiply(gradients, hiddenTranspose);

    // Adjust the weights by deltas
    this.weightsHiddenOutput.add(weightHiddenOutputDeltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.biasOutput.add(gradients);

    // Calculate the hidden layer errors
    let whoTranspose = Matrix.transpose(this.weightsHiddenOutput);
    let hiddenErrors = Matrix.multiply(whoTranspose, outputErrors);

    // Calculate hidden gradient
    let hiddenGradient = Matrix.map(hidden, dsigmoid);
    hiddenGradient.multiply(hiddenErrors);
    hiddenGradient.multiply(this.learningRate);

    // Calculate input to hidden deltas
    let inputsTranspose = Matrix.transpose(inputs);
    let weightInputHiddenDeltas = Matrix.multiply(hiddenGradient, inputsTranspose);

    this.weightsInputHidden.add(weightInputHiddenDeltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.biasHidden.add(hiddenGradient);
  }
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y) {
  return y * (1 - y);
}

// Example usage
const nn = new NeuralNetwork(2, 4, 1);
console.log(nn.feedforward([1, 0]));
nn.train([1, 0], [1]);
console.log(nn.feedforward([1, 0]));
