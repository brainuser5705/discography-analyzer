
import PropTypes from 'prop-types';

type ProfileProps = {
    name: string;
    picUrl: string;
    numAlbums: number;
}

function Profile(props: ProfileProps){

    return (
        <div className="profile">
            <img height="100px" src={props.picUrl} />
            <h1>{props.name}</h1>
            <ul>
                <li>Albums: {props.numAlbums}</li>
            </ul>
        </div>
    );
}

export default Profile;

Profile.propTypes = {
    name: PropTypes.string,
    picUrl: PropTypes.string,
    numAlbums: PropTypes.number,
}