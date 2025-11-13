-- Add title field and rename date to expense_date in expenses table
-- This aligns the schema with the AddExpenseModal component

-- Add title column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'title'
  ) THEN
    ALTER TABLE expenses ADD COLUMN title TEXT;
  END IF;
END $$;

-- Rename date to expense_date if not already renamed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'date'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'expense_date'
  ) THEN
    ALTER TABLE expenses RENAME COLUMN date TO expense_date;
  END IF;
END $$;

-- Add expense_date if it doesn't exist (for new installations)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'expense_date'
  ) THEN
    ALTER TABLE expenses ADD COLUMN expense_date DATE DEFAULT CURRENT_DATE;
  END IF;
END $$;
