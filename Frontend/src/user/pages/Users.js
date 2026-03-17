import react, { use } from 'react';
 
import UsersList from '../components/UsersList';

const Users = () => {
    const USERS = [
        {
            id: 'u1', 
            name: "Max Schwarts", 
            image: "https://static-cdn.jtvnw.net/jtv_user_pictures/9187e6b7-1297-4913-bfd3-9f2e415f7eec-profile_image-300x300.png", 
            places: 3
        }
    ];

    return <UsersList items={USERS} />;
}

export default Users;