// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import './App.css';

function App() {
  const [teamSize, setTeamSize] = useState(2);
  const [members, setMembers] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimezones(Intl.supportedValuesOf('timeZone'));
    setMembers(
      Array.from({ length: 2 }, () => ({
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        start: '',
        end: '',
      }))
    );
  }, []);

  const handleTeamSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setTeamSize(newSize);

    const newMembers = Array.from({ length: newSize }, (_, i) => {
      return members[i] || {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        start: '',
        end: '',
      };
    });
    setMembers(newMembers);
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    for (const member of members) {
      if (!member.timezone || !member.start || !member.end) {
        setError('Please fill in all fields for all team members.');
        setLoading(false);
        return;
      }
      if (new Date(member.start) >= new Date(member.end)) {
        setError('The start time must be before the end time for all members.');
        setLoading(false);
        return;
      }
    }

    try {
      const payload = members.map(m => ({
        timezone: m.timezone,
        start_local: m.start,
        end_local: m.end
      }));
      
      const response = await axios.post('http://127.0.0.1:8000/calculate-overlap', payload);
      setResult(response.data);

    } catch (err) {
      setError(err.response?.data?.detail || 'An unexpected error occurred. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  const formatResultTime = (utcString, timezone) => {
    // This function takes the UTC string, the target timezone,
    // and a format string, and returns the correctly formatted local time.
    return formatInTimeZone(utcString, timezone, 'MMM d, yyyy h:mm a (zzzz)');
  };


  return (
    <div className="container">
      <h1>🌍 Time Zone Team Scheduler</h1>
      <p>Find the perfect meeting time across different time zones.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="teamSize">How many people are meeting?</label>
          <input
            type="number"
            id="teamSize"
            value={teamSize}
            onChange={handleTeamSizeChange}
            min="2"
            max="10"
          />
        </div>

        {members.map((member, index) => (
          <div key={index} className="member-card">
            <h3>Person {index + 1}</h3>
            <div className="form-group">
              <label>Time Zone:</label>
              <select
                value={member.timezone}
                onChange={(e) => handleMemberChange(index, 'timezone', e.target.value)}
              >
                {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Available From:</label>
              <input
                type="datetime-local"
                value={member.start}
                onChange={(e) => handleMemberChange(index, 'start', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Available To:</label>
              <input
                type="datetime-local"
                value={member.end}
                onChange={(e) => handleMemberChange(index, 'end', e.target.value)}
              />
            </div>
          </div>
        ))}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Calculating...' : 'Find Best Time Slot'}
        </button>
      </form>
      
      {error && <div className="error-message">{error}</div>}

      {result && (
        <div className="result-card">
          <h2>✅ Best Meeting Slot Found!</h2>
          {result.is_overlap ? (
            <>
              <p>The best time to meet is between:</p>
              <p><strong>Start:</strong> {format(parseISO(result.overlap_start_utc), "MMM d, yyyy h:mm a 'UTC'")}</p>
              <p><strong>End:</strong> {format(parseISO(result.overlap_end_utc), "MMM d, yyyy h:mm a 'UTC'")}</p>
              <hr />
              <h4>This corresponds to:</h4>
              <ul>
                {members.map((member, index) => (
                    <li key={index}>
                      <strong>Person {index + 1} ({member.timezone}):</strong><br/>
                      {formatResultTime(result.overlap_start_utc, member.timezone)}
                       &nbsp;to&nbsp;
                      {formatResultTime(result.overlap_end_utc, member.timezone)}
                    </li>
                ))}
              </ul>
            </>
          ) : (
            <p><strong>Sorry, no overlapping time slot was found for all team members.</strong></p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;