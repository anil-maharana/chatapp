import React, { useEffect, useState } from 'react'
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';

const renderTagFunction = (value, getTagProps) => {
    return value.map(val => (
        <Chip key={val._id}
            avatar={<Avatar src={val.avatar} />}
            label={`${val.lastName}, ${val.firstName}`}
            variant="outlined"
        />
    ))
}
const renderOptionsFunction = (option, { selected }) => {
    return (
        <React.Fragment>
            <Chip
                avatar={<Avatar alt="Natacha" src={option.photo} />}
                label={`${option.lastName}, ${option.firstName}`}
                variant="outlined"
            />
        </React.Fragment>
    )
}
function UserSelection({
    field,
    label,
    name,
    id,
    value,
    form: { touched, errors },
    ...props
}) {
    const [users, setUsers] = useState([]);

    const handleChange = value => {
        // this is going to call setFieldValue and manually update values.topcis
        props.onChange('users', value);
    };

    // const handleBlur = () => {
    //     // this is going to call setFieldTouched and manually update touched.topcis
    //     props.onBlur('users', true);
    // };

    useEffect(() => {
        _fetchAllUsers()
    }, [])
    const _fetchAllUsers = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/users`);
        setUsers(data);
    }
    return (
        <div>
            <Autocomplete
                multiple
                onChange={(event, value, reason) => {
                    handleChange(value)
                }}
                renderTags={renderTagFunction}
                // renderOption={renderOptionsFunction}
                id="tags-outlined"
                options={users}
                getOptionLabel={(option) => `${option.lastName}, ${option.firstName}`}
                defaultValue={value}
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        {...field}
                        {...props}
                        variant="outlined"
                        label={label}
                        name={name}
                        placeholder="Users"
                        error={
                            touched[field.name] && Boolean(errors[field.name])
                        }
                        helperText={
                            errors[field.name]
                        }

                    />
                )}
            />
        </div>
    );
}
export default UserSelection
