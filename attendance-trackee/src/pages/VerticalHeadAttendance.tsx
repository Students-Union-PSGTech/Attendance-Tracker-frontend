import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [members, setMembers] = useState<Member[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<AttendanceMap>({});
  const [loading, setLoading] = useState(true);

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

  const getAttendanceChip = (percentage: string) => {
    const numPercentage = parseFloat(percentage);
    if (percentage === 'N/A') {
      return <Chip label="N/A" size="small" variant="outlined" />;
    } else if (numPercentage >= 80) {
      return <Chip label={`${percentage}%`} size="small" color="success" />;
    } else if (numPercentage >= 60) {
      return <Chip label={`${percentage}%`} size="small" color="warning" />;
    } else {
      return <Chip label={`${percentage}%`} size="small" color="error" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Members Attendance Report
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Attendance percentages for all members across {totalMeetings} meeting{totalMeetings !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => navigate('/dashboard')}
          sx={{ minWidth: 'auto' }}
        >
          ← Back to Dashboard
        </Button>
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
        <Paper elevation={2} sx={{ overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Roll No</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Meetings Attended</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Attendance %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map(member => {
                const attended = attendanceMap[member.roll_no] || 0;
                const percentage = totalMeetings > 0 ? ((attended / totalMeetings) * 100).toFixed(2) : 'N/A';
                return (
                  <TableRow key={member.roll_no} hover>
                    <TableCell sx={{ fontWeight: 'medium' }}>{member.roll_no}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{attended} / {totalMeetings}</TableCell>
                    <TableCell>{getAttendanceChip(percentage)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default VerticalHeadAttendance;