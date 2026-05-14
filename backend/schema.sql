-- 1. Enerji oxunuşları cədvəli (EnergyChart.tsx üçün)
create table energy_readings (
  id uuid default gen_random_uuid() primary key,
  month int not null,          -- 1=Yan, 2=Fev, ...
  value float not null,        -- kWh
  type text not null,          -- 'actual' və ya 'forecast'
  created_at timestamp default now()
);

-- Demo data əlavə et
insert into energy_readings (month, value, type) values
(1, 520, 'actual'),
(2, 498, 'actual'),
(3, 515, 'actual'),
(4, 540, 'actual'),
(5, 450, 'actual'),
(6, 418, 'actual'),
(7, 385, 'actual'),
(8, 360, 'actual'),
(8, 360, 'forecast'),
(9, 330, 'forecast'),
(10, 302, 'forecast'),
(11, 278, 'forecast'),
(12, 255, 'forecast');

-- 2. Cihazlar cədvəli (ControlPanel.tsx üçün)
create table devices (
  id uuid default gen_random_uuid() primary key,
  key text unique not null,
  is_on boolean default false,
  updated_at timestamp default now()
);

-- Demo cihazlar
insert into devices (key, is_on) values
('livingLight', true),
('bedroomLight', false),
('heating', true),
('airCon', false),
('tv', true),
('waterHeater', false),
('coffee', false),
('bedroomAc', false);
