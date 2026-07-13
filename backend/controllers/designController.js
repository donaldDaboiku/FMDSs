// controllers/designController.js
import Design from "../models/Design.js";

// @desc    Create a new design
// @route   POST /api/designs
// @access  Private
export const createDesign = async (req, res) => {
  try {
    const { name, category, fabric, color, description, image } = req.body;

    // Check if design with same name already exists
    const existingDesign = await Design.findOne({ 
      name, 
      createdBy: req.user.id 
    });

    if (existingDesign) {
      return res.status(400).json({ 
        error: "A design with this name already exists" 
      });
    }

    const design = await Design.create({
      name,
      category,
      fabric,
      color,
      description,
      image,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: "Design created successfully",
      design
    });
  } catch (error) {
    console.error("Design creation error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

// @desc    Get all designs for the logged-in user
// @route   GET /api/designs
// @access  Private
export const getDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    
    res.json(designs);
  } catch (error) {
    console.error("Get designs error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

// @desc    Get single design by ID
// @route   GET /api/designs/:id
// @access  Private
export const getDesignById = async (req, res) => {
  try {
    const design = await Design.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });

    if (!design) {
      return res.status(404).json({ error: "Design not found" });
    }

    res.json(design);
  } catch (error) {
    console.error("Get design error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

// @desc    Update a design
// @route   PUT /api/designs/:id
// @access  Private
export const updateDesign = async (req, res) => {
  try {
    const { name, category, fabric, color, description, image } = req.body;

    const design = await Design.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });

    if (!design) {
      return res.status(404).json({ error: "Design not found" });
    }

    // Check if name is being changed and if it conflicts with another design
    if (name && name !== design.name) {
      const existingDesign = await Design.findOne({ 
        name, 
        createdBy: req.user.id,
        _id: { $ne: req.params.id }
      });

      if (existingDesign) {
        return res.status(400).json({ 
          error: "A design with this name already exists" 
        });
      }
    }

    design.name = name || design.name;
    design.category = category || design.category;
    design.fabric = fabric || design.fabric;
    design.color = color || design.color;
    design.description = description || design.description;
    design.image = image || design.image;

    const updatedDesign = await design.save();

    res.json({
      message: "Design updated successfully",
      design: updatedDesign
    });
  } catch (error) {
    console.error("Update design error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

// @desc    Delete a design
// @route   DELETE /api/designs/:id
// @access  Private
export const deleteDesign = async (req, res) => {
  try {
    const design = await Design.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });

    if (!design) {
      return res.status(404).json({ error: "Design not found" });
    }

    await Design.deleteOne({ _id: req.params.id });

    res.json({ message: "Design removed successfully" });
  } catch (error) {
    console.error("Delete design error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
};