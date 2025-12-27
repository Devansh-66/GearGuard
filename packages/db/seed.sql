-- Teams
INSERT OR IGNORE INTO teams (id, name, members) VALUES 
('team-1', 'Heavy Mechanics', '["John Doe", "Mike Fixit"]'),
('team-2', 'IT Support', '["Alice Tech", "Bob Admin"]');

-- Equipment
INSERT OR IGNORE INTO equipment (id, name, serial_number, location, department, category, assigned_team_id, status, purchase_date) VALUES 
('eq-1', 'CAT Excavator 320', 'CAT-320-X99', 'Site A', 'Operations', 'Heavy Machinery', 'team-1', 'Active', '2023-01-01'),
('eq-2', 'Dell Precision 5000', 'DELL-9988', 'Office 302', 'Design', 'Computers', 'team-2', 'Active', '2024-02-15'),
('eq-3', 'Hydraulic Press', 'HP-500', 'Workshop', 'Production', 'Machinery', 'team-1', 'Scrapped', '2020-05-10');

-- Requests
INSERT OR IGNORE INTO maintenance_requests (id, title, description, equipment_id, team_id, type, priority, status, created_at, scheduled_date) VALUES 
('req-1', 'Engine Failure', 'Engine is smoking.', 'eq-1', 'team-1', 'Corrective', 'High', 'New', 1704067200000, NULL),
('req-2', 'Screen Flicker', 'Monitor blinking.', 'eq-2', 'team-2', 'Corrective', 'Low', 'In Progress', 1704153600000, NULL),
('req-3', 'Annual Service', 'Routine checkup.', 'eq-1', 'team-1', 'Preventive', 'Medium', 'New', 1704240000000, '2025-12-01'),
('req-4', 'Safety Inspection', 'Check guards.', 'eq-3', 'team-1', 'Preventive', 'High', 'Repaired', 1703000000000, '2025-12-10');
