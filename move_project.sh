#!/bin/bash
# Move to the projects directory
cd /Users/ankitkhati/Learning/Projects

# Check if Parent exists and rename
if [ -d "Restart2025" ]; then
    echo "Renaming Parent Restart2025 -> AntigravityProjects"
    mv Restart2025 AntigravityProjects
fi

# Check if Child exists (inside new Parent) and rename
if [ -d "AntigravityProjects/Restart2025" ]; then
    echo "Renaming Child Restart2025 -> Prism"
    mv AntigravityProjects/Restart2025 AntigravityProjects/Prism
fi

echo "Detailed Move Complete!"
go ahead