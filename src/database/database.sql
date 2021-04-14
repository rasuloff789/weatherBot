create table users(
  id serial not null primary key,
  user_id bigint not null,
  user_first_name varchar(40),
  user_last_name varchar(40),
  user_username varchar(36)
);