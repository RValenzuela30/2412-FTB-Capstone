const express = require("express");
const router = express.Router();

// do we even need a GET all orders? I feel like that would be something only the admin can do but functionally it would mean getting ALL orders from EVERYONE so
// I think instead it should be like get order by ID only and only the customer and the admin can have access to that
