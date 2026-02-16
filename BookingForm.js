

import React, { useState } from 'react';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    parentName: '',
    childAge: '',
    contactPhone: '',
    contactEmail: '',
    problemDescription: '',
    isSubmitted: false,
    error: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      error: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, isSubmitted: false, error: null }));

    if (!formData.parentName || !formData.contactPhone) {
      setFormData(prev => ({ ...prev, error: 'Please fill in required fields: Name and Phone.' }));
      return;
    }

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Form submission failed.');
      }

      setFormData({
        parentName: '',
        childAge: '',
        contactPhone: '',
        contactEmail: '',
        problemDescription: '',
        isSubmitted: true,
        error: null,
      });

    } catch (error) {
      setFormData(prev => ({ ...prev, error: 'An error occurred during submission. Please try again later.' }));
    }
  };

  if (formData.isSubmitted) {
    return (
      <div className="p-8 text-center bg-green-50 border-l-4 border-green-500 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-green-700">Thank You!</h3>
        <p className="mt-2 text-gray-600">Your application has been successfully sent. I will contact you shortly.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-xl" id="booking-form">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Schedule a Consultation</h2>
      <p className="text-center text-gray-600 mb-6">Take the first step towards a positive change.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {formData.error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border-l-4 border-red-500 rounded-md">
            {formData.error}
          </div>
        )}

        {/* Parent Name */}
        <div>
          <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="parentName"
            id="parentName"
            value={formData.parentName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Child Age */}
        <div>
          <label htmlFor="childAge" className="block text-sm font-medium text-gray-700">
            Child's Age (e.g., 8 years)
          </label>
          <input
            type="text"
            name="childAge"
            id="childAge"
            value={formData.childAge}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Contact Phone */}
        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
            Contact Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="contactPhone"
            id="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Contact Email */}
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="contactEmail"
            id="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Problem Description */}
        <div>
          <label htmlFor="problemDescription" className="block text-sm font-medium text-gray-700">
            Briefly describe the challenge
          </label>
          <textarea
            name="problemDescription"
            id="problemDescription"
            rows="4"
            value={formData.problemDescription}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Send Application
        </button>
      </form>
      
      <p className="mt-4 text-xs text-center text-gray-500">
          By submitting the form, you agree to the processing of personal data (Privacy Policy Link).
      </p>
    </div>
  );
};

export default BookingForm;