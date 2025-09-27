import React from 'react';

const RoleCheckbox = ({ onCheckboxChange, selectedRole }) => {
  return (
    <div className='flex flex-col mb-4'>
      <label className='block mb-2'>Account Type:</label>
      <div className='flex'>
        <div className='form-control mr-4'>
          <label className={`label gap-2 cursor-pointer ${selectedRole === 'Innovator' ? "font-bold text-blue-500" : ""}`}>
            <input 
              type='checkbox' 
              className='form-checkbox text-blue-600 h-4 w-4'
              checked={selectedRole === "Innovator"}
              onChange={() => onCheckboxChange(selectedRole === "Innovator" ? "" : "Innovator")}
            />
            <span className='label-text ml-2'>Innovator</span>
          </label> 
        </div>

        <div className='form-control'>
          <label className={`label gap-2 cursor-pointer ${selectedRole === 'Developer' ? "font-bold text-blue-500" : ""}`}>
            <input 
              type='checkbox' 
              className='form-checkbox text-blue-600 h-4 w-4'
              checked={selectedRole === "Developer"}
              onChange={() => onCheckboxChange(selectedRole === "Developer" ? "" : "Developer")}
            />
            <span className='label-text ml-2'>Developer</span>
          </label> 
        </div>
      </div>
    </div>
  );
};

export default RoleCheckbox;
