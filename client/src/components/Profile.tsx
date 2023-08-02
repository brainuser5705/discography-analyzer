import PropTypes from 'prop-types';

type ProfileProps = {
    name: string;
    picUrl: string;
    numAlbums: number;
}

function Profile(props: ProfileProps){

    return (
        <div className="item-display" id="profile">
            <img alt="" src={props.picUrl} />
            <div className="content">
                <div className="name">{props.name}</div>
                <div># of Albums: {props.numAlbums}</div>
            </div>
        </div>
    );
}

export default Profile;

Profile.propTypes = {
    name: PropTypes.string,
    picUrl: PropTypes.string,
    numAlbums: PropTypes.number,
}