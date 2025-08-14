# To-Do Board Backend - Group Support & Real-Time Activity Logs

## Overview

This backend now supports multi-group functionality with real-time activity logs using Socket.IO. Users can create groups, join via invite links, and all tasks and activity logs are scoped per group.

## New Features

### 1. Group Management
- Create groups with unique invite tokens
- Join groups via invite links
- Users can belong to multiple groups
- All data is scoped per group

### 2. Real-Time Activity Logs
- Socket.IO integration for live updates
- Group-specific rooms for isolated real-time updates
- Automatic activity logging for all task operations

## API Endpoints

### Group Management

#### Create Group
```
POST /api/groups
Authorization: Bearer <token>
Body: { "name": "Group Name" }
Response: Group object with inviteToken
```

#### Get User's Groups
```
GET /api/groups/my
Authorization: Bearer <token>
Response: Array of user's groups
```

#### Join Group
```
POST /api/groups/join
Authorization: Bearer <token>
Body: { "token": "invite_token" }
Response: Group object
```

### Tasks (Updated)

#### Create Task
```
POST /api/tasks
Authorization: Bearer <token>
Body: { 
  "title": "Task Title", 
  "description": "Description",
  "priority": "High",
  "groupId": "group_id_here"
}
```

#### Get Tasks
```
GET /api/tasks?groupId=<group_id>
Authorization: Bearer <token>
Response: Tasks filtered by group
```

### Activity Logs (Updated)

#### Get Activity Logs
```
GET /api/actions?groupId=<group_id>
Authorization: Bearer <token>
Response: Activity logs filtered by group
```

## Socket.IO Events

### Client to Server
- `join_group`: Join a group room for real-time updates
- `leave_group`: Leave a group room

### Server to Client
- `activity_log_updated`: New activity log entry (group-scoped)

## Database Schema Changes

### Group Model
```javascript
{
  name: String (required),
  creator: ObjectId (ref: User, required),
  members: [ObjectId] (ref: User),
  inviteToken: String (unique),
  timestamps: true
}
```

### Task Model (Updated)
```javascript
{
  // ... existing fields
  group: ObjectId (ref: Group, required)
}
```

### ActionLog Model (Updated)
```javascript
{
  // ... existing fields
  group: ObjectId (ref: Group, required)
}
```

## Usage Examples

### Frontend Integration

#### Join Group Room
```javascript
// When opening a group's board
socket.emit('join_group', groupId);

// Listen for activity updates
socket.on('activity_log_updated', (log) => {
  console.log('New activity:', log);
});
```

#### Leave Group Room
```javascript
// When closing a group's board
socket.emit('leave_group', groupId);
```

### Invite Link Format
```
https://yourapp.com/join/<inviteToken>
```

## Security Features

- All endpoints require authentication
- Users can only access groups they're members of
- Group-scoped data isolation
- Invite tokens are cryptographically secure

## Error Handling

- 404: Group not found
- 500: Server errors
- Proper validation for all inputs
- Group membership verification

## Dependencies

- `crypto`: For generating secure invite tokens
- `socket.io`: For real-time communication
- `mongoose`: For database operations 