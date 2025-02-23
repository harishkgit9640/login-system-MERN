import { useSelector } from 'react-redux';

const Dashboard = () => {
    const userData = useSelector((state) => state?.user);

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}

export default Dashboard