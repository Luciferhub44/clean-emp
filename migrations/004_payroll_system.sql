-- Create payroll_settings table
CREATE TABLE payroll_settings (
    id SERIAL PRIMARY KEY,
    base_salary DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL, -- Percentage for task completion
    po_commission_rate DECIMAL(5,2) NOT NULL, -- Additional percentage for PO tasks
    pay_period INTERVAL NOT NULL DEFAULT '1 month'::INTERVAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create employee_payroll table
CREATE TABLE employee_payroll (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES users(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    base_salary DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'paid')),
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create commission_records table
CREATE TABLE commission_records (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES users(id),
    task_id INTEGER REFERENCES tasks(id),
    payroll_id INTEGER REFERENCES employee_payroll(id),
    amount DECIMAL(10,2) NOT NULL,
    commission_type VARCHAR(50) NOT NULL CHECK (commission_type IN ('task_completion', 'po_completion')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_payroll_employee_id ON employee_payroll(employee_id);
CREATE INDEX idx_payroll_period ON employee_payroll(period_start, period_end);
CREATE INDEX idx_commission_employee_id ON commission_records(employee_id);
CREATE INDEX idx_commission_payroll_id ON commission_records(payroll_id);

-- Add trigger for updated_at
CREATE TRIGGER update_payroll_settings_updated_at
    BEFORE UPDATE ON payroll_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_payroll_updated_at
    BEFORE UPDATE ON employee_payroll
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 