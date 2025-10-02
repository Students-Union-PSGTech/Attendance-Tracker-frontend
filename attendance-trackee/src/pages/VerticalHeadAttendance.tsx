import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { verticalLeadAPI } from '../api';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Box,
  Button,
  Chip,
} from '@mui/material';

type Member = {
  roll_no: string;
  name: string;
  // add other member properties if needed
};

type Meeting = {
  _id: string;
  // add other meeting properties if needed
};

type AttendanceMap = {
  [roll_no: string]: number;
};

const VerticalHeadAttendance: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<AttendanceMap>({});
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const membersData = await verticalLeadAPI.getMembers();
        setMembers(membersData.members || membersData);

        const meetingsData = await verticalLeadAPI.getMeetings();
        const meetingsList = meetingsData.meetings || meetingsData;
        setMeetings(meetingsList);

        const attendanceMapTemp: { [roll_no: string]: number } = {};
        for (const meeting of meetingsList) {
          const attendanceData = await verticalLeadAPI.getMembersAttendance(meeting._id);
          for (const member of attendanceData.members) {
            if (member.is_attended === true) {
              attendanceMapTemp[member.roll_no] = (attendanceMapTemp[member.roll_no] || 0) + 1;
            }
          }
        }
        setAttendanceMap(attendanceMapTemp);
      } catch (err) {
        console.error('Error fetching data:', err);
        setMembers([]);
        setMeetings([]);
        setAttendanceMap({});
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const totalMeetings = meetings.length;

  const getAttendanceChip = (percentage: number | 'N/A') => {
    if (percentage === 'N/A' || percentage === undefined || percentage === null || isNaN(Number(percentage))) {
      return <Chip label="N/A" size="small" variant="outlined" />;
    }
    const numPercentage = Number(percentage);
    if (numPercentage >= 80) {
      return <Chip label={`${numPercentage.toFixed(2)}%`} size="small" color="success" />;
    } else if (numPercentage >= 60) {
      return <Chip label={`${numPercentage.toFixed(2)}%`} size="small" color="warning" />;
    } else {
      return <Chip label={`${numPercentage.toFixed(2)}%`} size="small" color="error" />;
    }
  };

  // Sort state: 'desc' = high to low, 'asc' = low to high
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sort members by attendance percentage
  const sortedMembers = [...members].sort((a, b) => {
    const attendedA = attendanceMap[a.roll_no] || 0;
    const attendedB = attendanceMap[b.roll_no] || 0;
    const percentA = totalMeetings > 0 ? attendedA / totalMeetings : 0;
    const percentB = totalMeetings > 0 ? attendedB / totalMeetings : 0;
    if (sortOrder === 'asc') {
      return percentA - percentB;
    } else {
      return percentB - percentA;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Members Attendance Summary</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.name || user?.roll_no}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 min-h-[40px]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="py-6">
        <Container maxWidth="lg" sx={{ px: { xs: 0.5, sm: 2 } }}>
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ textAlign: { xs: 'center', sm: 'left' }, fontSize: { xs: 22, sm: 28 } }}
              >
                Attendance Overview
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: { xs: 'center', sm: 'left' }, fontSize: { xs: 14, sm: 16 } }}
              >
                Tracking attendance across {totalMeetings} meeting{totalMeetings !== 1 ? 's' : ''} in your vertical
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                bgcolor: 'rgba(245,250,255,0.95)',
                borderRadius: 2,
                px: 2,
                py: 1,
                boxShadow: 2,
                border: '1.5px solid',
                borderColor: 'primary.main',
                minWidth: 170,
                transition: 'box-shadow 0.2s',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  fontSize: { xs: 14, sm: 15 },
                  mr: 0.5,
                  letterSpacing: 0.2,
                }}
              >
                Sort by
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-block', minWidth: 100 }}>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  style={{
                    background: '#fff',
                    border: '1.5px solid #1976d2',
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: 15,
                    color: '#1976d2',
                    width: '100%',
                    padding: '8px 18px',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    transition: 'background 0.2s',
                    textAlign: 'center',
                  }}
                >
                  <option value="desc">High to Low</option>
                  <option value="asc">Low to High</option>
                </select>
              </Box>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={50} />
            </Box>
          ) : members.length === 0 ? (
            <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Members Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add members to your vertical to view attendance reports.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/members/add')}
                sx={{ mt: 2 }}
              >
                Add Members
              </Button>
            </Paper>
          ) : (
            <Paper
              elevation={2}
              sx={{ width: '100%', overflowX: 'auto', boxShadow: { xs: 0, sm: 2 }, borderRadius: { xs: 1, sm: 2 } }}
            >
              <Table sx={{ minWidth: 400, width: '100%', tableLayout: 'auto' }}>
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        fontSize: { xs: 12, sm: 16 },
                        px: { xs: 1, sm: 2 },
                        py: { xs: 1, sm: 2 },
                      }}
                    >
                      Roll No
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        fontSize: { xs: 12, sm: 16 },
                        px: { xs: 1, sm: 2 },
                        py: { xs: 1, sm: 2 },
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        fontSize: { xs: 12, sm: 16 },
                        px: { xs: 1, sm: 2 },
                        py: { xs: 1, sm: 2 },
                      }}
                    >
                      Meetings Attended
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        fontSize: { xs: 12, sm: 16 },
                        px: { xs: 1, sm: 2 },
                        py: { xs: 1, sm: 2 },
                      }}
                    >
                      Attendance %
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedMembers.map((member) => {
                    const attended = attendanceMap[member.roll_no] || 0;
                    const percentage = totalMeetings > 0 ? (attended / totalMeetings) * 100 : 'N/A';
                    return (
                      <TableRow
                        key={member.roll_no}
                        hover
                        sx={{ '& td': { fontSize: { xs: 12, sm: 15 }, px: { xs: 1, sm: 2 }, py: { xs: 1, sm: 2 } } }}
                      >
                        <TableCell sx={{ fontWeight: 'medium' }}>{member.roll_no}</TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>
                          {attended} / {totalMeetings}
                        </TableCell>
                        <TableCell>{getAttendanceChip(percentage)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Container>
      </main>
    </div>
  );
};

export default VerticalHeadAttendance;