"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { CREATE_STUDENT, GET_USERS, GET_STUDENTS } from "@/lib/graphql-queries";
import { X, UserPlus, Loader2 } from "lucide-react";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddStudentModal({ isOpen, onClose }: AddStudentModalProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");

  // Fetch parents for selection (get first parent as default)
  const { data: usersData, loading: loadingUsers } = useQuery(GET_USERS, {
    variables: { role: "PARENT" },
    skip: !isOpen,
  });

  const [createStudent, { loading: creating }] = useMutation(CREATE_STUDENT, {
    onCompleted: () => {
      // Reset form
      setName("");
      setAge("");
      setError("");
      onClose();
    },
    onError: (error) => {
      setError(error.message);
    },
    refetchQueries: [{ query: GET_STUDENTS, fetchPolicy: "network-only" }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !age) {
      setError("Please fill in all required fields");
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 18) {
      setError("Please enter a valid age between 0 and 18");
      return;
    }

    // Get first parent as default
    const parents = usersData?.users || [];
    if (parents.length === 0) {
      setError("No parent accounts found. Please create a parent account first.");
      return;
    }

    // Calculate approximate date of birth from age
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - ageNum;
    const dateOfBirth = `${birthYear}-01-01`;

    try {
      await createStudent({
        variables: {
          input: {
            name,
            class: `${age} years old`,
            dateOfBirth,
            parentId: parents[0].id,
          },
        },
      });
    } catch (err) {
      // Error handled in onError
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Add New Student</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Student Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter student name"
                required
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age (years old) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter age"
                min="0"
                max="18"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating || loadingUsers}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Add Student
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
