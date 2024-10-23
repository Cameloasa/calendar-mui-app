import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const localizer = momentLocalizer(moment);

const MeetingCalendar = () => {
  const [events, setEvents] = useState([
    {
      start: new Date(),
      end: new Date(),
      title: "Today's Event",
      dressCode: "Formal",
      agenda: "Meeting Agenda goes here",
      dinner: "Dinner details here",
      cost: {
        dinner: true,
        wine: true,
        beer: false,
        schnapps: false,
        avec: false,
      },
      reminder: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(true); // Loading state for skeletons
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dressCode, setDressCode] = useState("Formal");
  const [agenda, setAgenda] = useState("");
  const [dinner, setDinner] = useState("");
  const [cost, setCost] = useState({
    dinner: true,
    wine: false,
    beer: false,
    schnapps: false,
    avec: false,
  });
  const [reminder, setReminder] = useState(new Date());
  const [editingEventIndex, setEditingEventIndex] = useState(null);

  // Simulate loading for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Helper to strip the time portion from a date
  const stripTime = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Handle selecting a day (slot)
  const handleSelectSlot = ({ start, end }) => {
    const today = stripTime(new Date()); // Today's date with time set to 00:00:00
    const selectedStart = stripTime(start); // Selected date with time set to 00:00:00

    if (selectedStart >= today) {
      setSelectedSlot({ start, end });
      setStartDate(start);
      setEndDate(end);
      setEventTitle("");
      setDressCode("Formal");
      setAgenda("");
      setDinner("");
      setCost({
        dinner: true,
        wine: false,
        beer: false,
        schnapps: false,
        avec: false,
      });
      setReminder(new Date());
      setShowForm(true);
      setEditingEventIndex(null);
    }
  };

  // Handle submitting the event form
  const handleFormSubmit = () => {
    const newEvent = {
      title: eventTitle,
      start: startDate,
      end: endDate,
      dressCode,
      agenda,
      dinner,
      cost,
      reminder,
    };

    if (editingEventIndex !== null) {
      const updatedEvents = [...events];
      updatedEvents[editingEventIndex] = newEvent;
      setEvents(updatedEvents);
    } else {
      setEvents([...events, newEvent]);
    }

    setShowForm(false);
    setEventTitle("");
    setEditingEventIndex(null);
  };

  // Handle closing the event form without saving
  const handleFormClose = () => {
    setShowForm(false);
    setEventTitle("");
    setEditingEventIndex(null);
  };

  // Handle event editing
  const handleEditEvent = (event, index) => {
    setEventTitle(event.title);
    setStartDate(event.start);
    setEndDate(event.end);
    setDressCode(event.dressCode);
    setAgenda(event.agenda);
    setDinner(event.dinner);
    setCost(event.cost);
    setReminder(event.reminder);
    setEditingEventIndex(index);
    setShowForm(true);
  };

  // Handle event removal
  const handleRemoveEvent = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
  };

  // Handle cost checkboxes
  const handleCostChange = (event) => {
    setCost({ ...cost, [event.target.name]: event.target.checked });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mt={5}
      flexDirection="column"
    >
      <Card elevation={3} style={{ width: "90%", maxWidth: "1000px" }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Meeting Calendar
          </Typography>

          <div style={{ height: "500px" }}>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height={500} />
            ) : (
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%", width: "100%", borderRadius: "8px" }}
                selectable
                onSelectSlot={handleSelectSlot}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Form Dialog */}
      <Dialog open={showForm} onClose={handleFormClose}>
        <DialogTitle>
          {editingEventIndex !== null ? "Edit Event" : "Add New Event"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            type="text"
            fullWidth
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="datetime-local"
            fullWidth
            value={moment(startDate).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
          <TextField
            margin="dense"
            label="End Date"
            type="datetime-local"
            fullWidth
            value={moment(endDate).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
          <TextField
            margin="dense"
            label="Agenda"
            type="text"
            fullWidth
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Dinner"
            type="text"
            fullWidth
            value={dinner}
            onChange={(e) => setDinner(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Reminder Date"
            type="datetime-local"
            fullWidth
            value={moment(reminder).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => setReminder(new Date(e.target.value))}
          />
          <TextField
            select
            margin="dense"
            label="Dress Code"
            fullWidth
            value={dressCode}
            onChange={(e) => setDressCode(e.target.value)}
          >
            <MenuItem value="Formal">Formal (full dress)</MenuItem>
            <MenuItem value="Semi-formal">Semi-formal (suit with tie)</MenuItem>
            <MenuItem value="Theme">Theme (Halloween)</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
          </TextField>
          <Typography variant="subtitle1" gutterBottom>
            Select Costs:
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={cost.dinner}
                onChange={handleCostChange}
                name="dinner"
              />
            }
            label="Dinner (350 kr, includes alcohol-free beverage)"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cost.wine}
                onChange={handleCostChange}
                name="wine"
              />
            }
            label="Wine (60 kr)"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cost.beer}
                onChange={handleCostChange}
                name="beer"
              />
            }
            label="Beer (50 kr)"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cost.schnapps}
                onChange={handleCostChange}
                name="schnapps"
              />
            }
            label="Schnapps (50 kr)"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cost.avec}
                onChange={handleCostChange}
                name="avec"
              />
            }
            label="Avec (60 kr)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} color="primary">
            {editingEventIndex !== null ? "Update Event" : "Add Event"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Event Table */}
      <TableContainer
        component={Paper}
        sx={{ mt: 4, bgcolor: "#f0f0f0", width: "90%", maxWidth: "1000px" }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#333", color: "#fff" }}>
            <TableRow>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                Event Title
              </TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                Start Date
              </TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                End Date
              </TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                Dress Code
              </TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                Agenda
              </TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                Dinner
              </TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                Costs
              </TableCell>
              <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(3)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" />
                  </TableCell>
                </TableRow>
              ))
            ) : events.length > 0 ? (
              events.map((event, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{event.title}</TableCell>
                  <TableCell align="center">
                    {moment(event.start).format("MMMM Do YYYY, h:mm A")}
                  </TableCell>
                  <TableCell align="center">
                    {moment(event.end).format("MMMM Do YYYY, h:mm A")}
                  </TableCell>
                  <TableCell align="center">{event.dressCode}</TableCell>
                  <TableCell align="center">{event.agenda}</TableCell>
                  <TableCell align="center">{event.dinner}</TableCell>
                  <TableCell align="center">
                    {event.cost.dinner ? "Dinner " : ""}
                    {event.cost.wine ? "Wine " : ""}
                    {event.cost.beer ? "Beer " : ""}
                    {event.cost.schnapps ? "Schnapps " : ""}
                    {event.cost.avec ? "Avec " : ""}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEditEvent(event, index)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleRemoveEvent(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No events found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MeetingCalendar;
