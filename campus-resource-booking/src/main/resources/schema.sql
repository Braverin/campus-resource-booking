
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(30) NOT NULL,
  credit_score INT NOT NULL DEFAULT 100
);

CREATE TABLE resources (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  type VARCHAR(40) NOT NULL,
  capacity INT NOT NULL,
  version BIGINT DEFAULT 0 NOT NULL
);

CREATE TABLE bookings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  resource_id BIGINT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(30) NOT NULL,
  deposit_cents BIGINT NOT NULL DEFAULT 0,
  penalty_cents BIGINT NOT NULL DEFAULT 0,
  version BIGINT DEFAULT 0 NOT NULL,
  CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_booking_res FOREIGN KEY (resource_id) REFERENCES resources(id)
);

CREATE INDEX idx_booking_res_time ON bookings(resource_id, start_time, end_time);
