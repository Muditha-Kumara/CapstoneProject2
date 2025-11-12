ALTER TABLE requests
  ADD COLUMN location text,
  ADD COLUMN meal_time text,
  ADD COLUMN phone_number text,
  ADD COLUMN dietary_needs text,
  ADD COLUMN num_children int;