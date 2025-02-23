-- Add response fields to tasks table
ALTER TABLE tasks
ADD COLUMN employee_response VARCHAR(50) CHECK (employee_response IN ('accepted', 'rejected')),
ADD COLUMN response_notes TEXT,
ADD COLUMN response_date TIMESTAMP WITH TIME ZONE;

-- Add trigger to update response_date
CREATE OR REPLACE FUNCTION update_task_response_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.employee_response IS NOT NULL AND OLD.employee_response IS NULL THEN
        NEW.response_date = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_task_response_date
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_task_response_date(); 