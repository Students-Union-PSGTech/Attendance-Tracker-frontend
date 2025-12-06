import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verticalLeadAPI } from '../api';
import ConfirmationModal from '../components/ConfirmationModal';

interface FormData {
  verticalHeadName: string;
  rollNumber: string;
  reason: string;
}

interface MemberDetails {
  roll_no: string;
  name?: string;
  vertical?: string;
  department?: string;
  attendance_percentage?: number;
  meetings_attended?: number;
  total_meetings?: number;
  is_lead?: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

const VerticalHeadDeleteRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    verticalHeadName: '',
    rollNumber: '',
    reason: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [memberDetails, setMemberDetails] = useState<MemberDetails | null>(null);
  const [fetchingMemberDetails, setFetchingMemberDetails] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchMemberDetails = async () => {
    if (!formData.verticalHeadName.trim()) {
      setMessage({ type: 'error', text: 'Please enter your name' });
      return;
    }
    if (!formData.rollNumber.trim()) {
      setMessage({ type: 'error', text: 'Please enter the member\'s roll number' });
      return;
    }

    try {
      setFetchingMemberDetails(true);
      setMessage(null);
      // Fetch member details from the API using the deletion-details endpoint
      const response = await verticalLeadAPI.getMemberDeletionDetails(formData.rollNumber.trim());
      const memberData = response.member_details || { roll_no: formData.rollNumber.trim() };
      
      // Check if member is a lead (vertical head/lead)
      if (memberData.is_lead) {
        setMessage({ 
          type: 'error', 
          text: 'Cannot request deletion of lead members. Please contact the global admin to remove a lead.' 
        });
        setFetchingMemberDetails(false);
        return;
      }

      setMemberDetails({
        roll_no: memberData.roll_no,
        name: memberData.name,
        vertical: memberData.vertical,
        department: memberData.department,
        attendance_percentage: memberData.attendance_percentage,
        meetings_attended: memberData.meetings_attended,
        total_meetings: memberData.total_meetings,
        is_lead: memberData.is_lead
      });
      setShowConfirmation(true);
    } catch (error: any) {
      console.error('Error fetching member details:', error);
      const errorMessage = error?.error || 'Member not found. Please check the roll number and try again.';
      setMessage({ 
        type: 'error', 
        text: errorMessage
      });
    } finally {
      setFetchingMemberDetails(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    await fetchMemberDetails();
  };

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      const response: ApiResponse = await verticalLeadAPI.requestMemberDeletion(
        formData.rollNumber.trim(),
        formData.reason.trim() || undefined,
        formData.verticalHeadName.trim()
      );

      setMessage({ 
        type: 'success', 
        text: response.message || 'Delete request submitted successfully! The global admin will review your request.' 
      });
      
      setShowConfirmation(false);
      // Reset form after successful submission
      setFormData({ verticalHeadName: '', rollNumber: '', reason: '' });
      setMemberDetails(null);
      
    } catch (error: any) {
      console.error('Error submitting delete request:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to submit delete request. Please try again.' 
      });
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-slate-800 shadow-xl shadow-blue-500/10 dark:shadow-slate-900/40 transition-colors">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Request Member Deletion
            </h3>
            <button
              onClick={() => navigate('/vertical-head/dashboard')}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="verticalHeadName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Your Name (Vertical Head) *
              </label>
              <input
                type="text"
                id="verticalHeadName"
                name="verticalHeadName"
                value={formData.verticalHeadName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md shadow-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your name"
                required
                disabled={isLoading || fetchingMemberDetails}
              />
            </div>

            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Roll Number of Member to be Deleted *
              </label>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md shadow-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter roll number of member to be deleted"
                required
                disabled={isLoading || fetchingMemberDetails}
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Reason (Optional)
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-md shadow-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Provide a reason for the deletion request (optional)"
                disabled={isLoading || fetchingMemberDetails}
              />
            </div>

            {message && (
              <div className={`text-sm p-3 rounded-md border ${
                message.type === 'success' 
                  ? 'text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-500/40'
                  : 'text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-500/40'
              }`}>
                {message.text}
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => navigate('/vertical-head/dashboard')}
                disabled={isLoading || fetchingMemberDetails}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-100 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || fetchingMemberDetails || !formData.verticalHeadName.trim() || !formData.rollNumber.trim()}
                className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {fetchingMemberDetails ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                    Fetching Details...
                  </>
                ) : isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showConfirmation && memberDetails && (
        <ConfirmationModal
          isOpen={showConfirmation}
          title="Confirm Member Deletion Request"
          message={
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-lg p-5 border border-blue-200 dark:border-slate-600">
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Member Information
                </h4>
                <div className="space-y-3">
                  {memberDetails.name && (
                    <div className="flex justify-between items-center pb-2 border-b border-blue-200 dark:border-slate-600">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Name</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {memberDetails.name}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between items-center pb-2 border-b border-blue-200 dark:border-slate-600">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Roll Number</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {memberDetails.roll_no}
                    </p>
                  </div>
                  {memberDetails.department && (
                    <div className="flex justify-between items-center pb-2 border-b border-blue-200 dark:border-slate-600">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Department</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {memberDetails.department}
                      </p>
                    </div>
                  )}
                  {memberDetails.vertical && (
                    <div className="flex justify-between items-center pb-2 border-b border-blue-200 dark:border-slate-600">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Vertical</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {memberDetails.vertical}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {memberDetails.meetings_attended !== undefined && memberDetails.total_meetings !== undefined && (
                  <>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700/50">
                      <p className="text-xs text-purple-600 dark:text-purple-300 font-medium">Attended</p>
                      <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                        {memberDetails.meetings_attended}
                      </p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700/50">
                      <p className="text-xs text-indigo-600 dark:text-indigo-300 font-medium">Total</p>
                      <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                        {memberDetails.total_meetings}
                      </p>
                    </div>
                  </>
                )}
                {memberDetails.attendance_percentage !== undefined && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700/50">
                    <p className="text-xs text-green-600 dark:text-green-300 font-medium">Percentage</p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">
                      {memberDetails.attendance_percentage.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>

              {formData.reason && (
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Deletion Reason
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {formData.reason}
                  </p>
                </div>
              )}

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-700/50">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  This deletion request will be sent to the global admin for review.
                </p>
              </div>
            </div>
          }
          onConfirm={confirmDelete}
          onClose={() => setShowConfirmation(false)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default VerticalHeadDeleteRequestPage;