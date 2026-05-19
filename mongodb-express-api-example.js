/**
 * Nexus Storage - Express.js + MongoDB API Integration Example
 * 
 * This file demonstrates how to build the backend for the "Add Node" feature 
 * using a standalone Express.js server and MongoDB (Mongoose). 
 * 
 * Note: Since your main project uses Next.js App Router, you can also 
 * adapt this Mongoose schema directly inside your Next.js API routes!
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. MONGODB SCHEMA & MODEL
// ==========================================
const nodeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Node name is required'],
    trim: true 
  },
  ip: { 
    type: String, 
    required: [true, 'IP address is required'],
    unique: true,
    match: [/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Please provide a valid IPv4 address']
  },
  region: { 
    type: String, 
    required: true,
    enum: ['US-East-1', 'US-West-1', 'EU-Central-1', 'AP-South-1'],
    default: 'US-East-1'
  },
  capacity: { 
    type: Number, 
    required: true,
    min: [1, 'Capacity must be at least 1 TB']
  },
  status: { 
    type: String, 
    enum: ['online', 'syncing', 'offline'], 
    default: 'online' 
  },
  replicationEnabled: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

const Node = mongoose.model('Node', nodeSchema);


// ==========================================
// 2. API ROUTES
// ==========================================

/**
 * @route   GET /api/v1/nodes
 * @desc    Get all storage nodes
 */
app.get('/api/v1/nodes', async (req, res) => {
  try {
    const nodes = await Node.find().sort({ createdAt: -1 });
    
    // Transform output to match frontend expectations if necessary
    const formattedNodes = nodes.map(node => ({
      id: node._id,
      name: node.name,
      ip: node.ip,
      region: node.region,
      capacity: node.capacity,
      status: node.status,
      replicationEnabled: node.replicationEnabled
    }));

    res.status(200).json(formattedNodes);
  } catch (error) {
    console.error("Error fetching nodes:", error);
    res.status(500).json({ error: 'Server Error: Failed to fetch nodes' });
  }
});

/**
 * @route   POST /api/v1/nodes
 * @desc    Register a new storage node
 */
app.post('/api/v1/nodes', async (req, res) => {
  try {
    const { name, ip, region, capacity, status } = req.body;

    // Check if node with IP already exists
    const existingNode = await Node.findOne({ ip });
    if (existingNode) {
      return res.status(409).json({ error: 'A node with this IP address already exists.' });
    }

    // Create new node instance
    const newNode = new Node({
      name,
      ip,
      region,
      capacity,
      status
    });

    // Save to MongoDB
    await newNode.save();

    res.status(201).json({
      id: newNode._id,
      name: newNode.name,
      ip: newNode.ip,
      region: newNode.region,
      capacity: newNode.capacity,
      status: newNode.status,
      message: 'Node deployed successfully'
    });

  } catch (error) {
    console.error("Error adding node:", error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Server Error: Failed to add node' });
  }
});


// ==========================================
// 3. SERVER BOOTSTRAP
// ==========================================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexus_storage';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 API Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1);
  });
