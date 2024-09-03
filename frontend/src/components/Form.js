import React, { useState, useEffect } from 'react';
import '../App.css';
import { sendInputs } from '../api/api';

export const FormRow = ({ index, value, handleInputChange, handleDeleteRow, result }) => {
    return (
        <div className="form-group row form-row align-items-center">
            <label className="col-sm-2 col-form-label col-form-label-lg">
                URL
            </label>
            <div className="col-sm-10 d-flex align-items-center">
                <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter URL Here"
                    value={value}
                    onChange={(event) => handleInputChange(index, event)}
                    style={{ flex: 1 }}
                />
                {index > 2 && (
                    <button
                        type="button"
                        className="btn btn-danger btn-sm ml-2"
                        onClick={() => handleDeleteRow(index)}
                    >
                        x
                    </button>
                )}
            </div>
            <div className="col-sm-12">
                {result && result.url && (
                    <div className="result-info mt-2">
                        <h4>{result.title}</h4>
                        <p><strong>URL:</strong> {result.url}</p>
                        <p><strong>Description:</strong> {result.description}</p>
                        <p><strong>Keywords:</strong> {result.keywords}</p>
                        <img
                            src={result.screenshot}
                            alt={`Screenshot of ${result.url}`}
                            style={{ maxWidth: '100%', height: 'auto' }}
                        />
                    </div>
                )}
                {result && result.error && (
                    <div className="result-info mt-2">
                        <h4>{result.error}</h4>
                    </div>
                )}
            </div>
        </div>
    );
};
export const isValidUrl = (input) => {
    try {
        new URL(input); // Try creating a new URL object
        return true;    // If successful, input is a valid URL
    } catch (e) {
        return false;   // If an error is thrown, input is not a valid URL
    }
};

export const LoadingSpinner = ({ loading }) => {
    return (
      <>
        {loading && (
          <div className="spinner-container">
            <div className="spinner-border spinner" role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        )}
      </>
    );
  };

export const Form = () => {
    const [rows, setRows] = useState([0, 1, 2]); // Initialize with three rows
    const [inputs, setInputs] = useState({});
    const [results, setResults] = useState({}); // State to hold the results
    const [loading, setLoading] = useState(false)


    const addRow = () => {
        setRows([...rows, rows.length]); // Add a new row
    };

    const handleInputChange = (index, event) => {
        const { value } = event.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            [index]: value,
        }));
    };
    const handleDeleteRow = (index) => {
        // Remove the row from the rows array
        const newRows = [...rows];
        newRows.splice(index, 1);
    
        // Create a new inputs object without the deleted row
        const newInputs = {};
        Object.keys(inputs).forEach((key) => {
            const keyAsNumber = parseInt(key, 10);
            if (keyAsNumber < index) {
                newInputs[keyAsNumber] = inputs[keyAsNumber]; // Keep inputs before the deleted row
            } else if (keyAsNumber > index) {
                newInputs[keyAsNumber - 1] = inputs[keyAsNumber]; // Shift inputs after the deleted row
            }
        });
    
        // Create a new results object without the deleted row
        const newResults = {};
        Object.keys(results).forEach((key) => {
            const keyAsNumber = parseInt(key, 10);
            if (keyAsNumber < index) {
                newResults[keyAsNumber] = results[keyAsNumber]; // Keep results before the deleted row
            } else if (keyAsNumber > index) {
                newResults[keyAsNumber - 1] = results[keyAsNumber]; // Shift results after the deleted row
            }
        });
    
        setRows(newRows); // Update the rows state
        setInputs(newInputs); // Update the inputs state
        setResults(newResults); // Update the results state
    };
    
    const submit = async (event) => {
        event.preventDefault(); // Prevent default form submission
    
        const lengthInputs = Object.keys(inputs).length;
        if (lengthInputs < 3) {
            alert('You need to Enter at least three URLs');
            return;
        }
    
        // Check if all inputs are valid URLs
        const areValidUrls = Object.values(inputs).every(input => isValidUrl(input));
    
        if (!areValidUrls) {
            alert('One or more of the inputs are not valid URLs.');
            return; // Exit the function if validation fails
        }
    
        // Start loading spinner
        setLoading(true);
    
        try {
            const response = await sendInputs(inputs);
    
            // Map results to inputs
            const resultsMap = Object.keys(inputs).reduce((acc, key) => {
                acc[key] = response[key] || null;
                return acc;
            }, {});
            setResults(resultsMap); // Update state with results
        } catch (error) {
            console.error('Error sending inputs:', error);
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };
    
    return (
        <form onSubmit={submit}>
            {rows.map((row, index) => (
                <FormRow
                    key={index}
                    index={index}
                    value={inputs[index] || ''}
                    handleInputChange={handleInputChange}
                    handleDeleteRow={handleDeleteRow}
                    result={results[index]} // Pass result corresponding to the input index
                />
            ))}

        {loading && <LoadingSpinner loading={loading} />}


            <div className="buttons">
                <button type="submit" className="btn btn-primary mt-3">
                    Submit
                </button>
                <button
                    type="button"
                    className="btn btn-primary mt-3"
                    onClick={addRow}
                >
                    Add New Row
                </button>
            </div>
        </form>
    );
};

