import React from 'react'
import TestRenderer from 'react-test-renderer'
import {Form, FormRow, isValidUrl, LoadingSpinner} from '../src/components/Form'
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 


describe('FormRow Component', () => {
    it('renders correctly with minimum required props', () => {
        const mockHandleInputChange = jest.fn(); //mock functions
        const mockHandleDeleteRow = jest.fn();

        const testRenderer = TestRenderer.create(
            <FormRow
                index={1}
                value="http://test.com"
                handleInputChange={mockHandleInputChange}
                handleDeleteRow={mockHandleDeleteRow}
                result={null}
            />
        );
        const testInstance = testRenderer.root;

        // Check the input field
        const input = testInstance.findByType('input');
        const expectedValue1 = 'http://test.com'
        expect(input.props.value).toBe(expectedValue1);

        // Check that the delete button is not rendered when index <= 2
        const deleteButton = testInstance.findAllByType('button');
        const expectedValue2 = 0
        expect(deleteButton.length).toBe(expectedValue2);

        // Check if result info is not rendered when result is null
        const resultInfo = testInstance.findAllByProps({ className: 'result-info mt-2' });
        const expectedValue3 = 0
        expect(resultInfo.length).toBe(expectedValue3);
    });
})

describe('isValidUrl works properly', () =>{
    it('determines the URL is invalid', ()=>{
        const mockUrl1 = 'test'
        const expectedResult1 = false
        expect(isValidUrl(mockUrl1)).toBe(expectedResult1)
    })
    it('determines the URL is valid', () =>{
        const mockUrl2 = 'https://test.com'
        const expectedResult2 = true
        expect(isValidUrl(mockUrl2)).toBe(expectedResult2)
    })
})

describe('LoadingSpinner Component', () => {
    it('renders spinner when loading is true', () => {
      render(<LoadingSpinner loading={true} />);
  
      // Check if the spinner is in the document
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  
    it('does not render spinner when loading is false', () => {
      render(<LoadingSpinner loading={false} />);
  
      // Check that the spinner is not in the document
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

