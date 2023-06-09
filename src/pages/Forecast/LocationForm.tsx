import React from "react";

interface LocationFormProps {
    handleSubmit: (location: string) => Promise<void>;
}

const LocationForm: React.FC<LocationFormProps> = ({ handleSubmit }) => {
    const [location, setLocation] = React.useState("");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(location);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value);
    };

    return (
        <form onSubmit={onSubmit} className="form-container">
            <input type="text" placeholder="Enter Location" onChange={onChange} />
            <button type="submit">Get Forcast</button>
        </form>
    );
};

export default LocationForm;
