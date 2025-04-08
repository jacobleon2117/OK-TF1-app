# Database Structure

## Any changed or new collections please update them in here.

## Collections

### Users
```
users/
  {userId}/
    displayName: string
    email: string
    organizationCode: string
    role: string ('admin', 'manager', 'employee')
```

### Schedules
```
schedules/
  {userId}/
    availability/
      {date}/
        morning: boolean
        afternoon: boolean
        evening: boolean
        notes: string
```

### Shifts
```
shifts/
  {shiftId}/
    title: string
    startTime: timestamp
    endTime: timestamp
    location: string
    status: string ('open', 'assigned', 'completed')
    assignedUsers: array
```

### Time Off Requests
```
timeOffRequests/
  {requestId}/
    userId: string
    startDate: timestamp
    endDate: timestamp
    reason: string
    status: string ('pending', 'approved', 'denied')
```

## Access Rules
- Users can only access their own data
- Admins can access all data
- Shifts are viewable by all members of a team