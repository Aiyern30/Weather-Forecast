CREATE TABLE setting (
    settingid UUID PRIMARY KEY,
    userid UUID REFERENCES "user"(UserID),
    textsize INT,
    theme VARCHAR(10)
);