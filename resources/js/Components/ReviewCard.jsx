import RattingStars from '@/Components/rattingStar';

const ReviewCard = ({ review }) => {
    // console.log(review);

    const dataConvert = (data) => {
        const date = new Date(data);
        const day = date.getDate().toPrecision(2);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }


    return (
        <div className="bg-transparent p-4 rounded-lg shadow-md border border-1 border-gray-800 m-2">
            <div className="flex items-center mb-4">
                <img
                    src={review.from_user.avatar}
                    alt={review.from_user.name}
                    className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                    <h3 className="text-lg font-semibold">{review.from_user.name}</h3>
                    <p className="text-gray-400">{dataConvert(review.created_at)}</p>
                </div>
                <div className="ml-auto">
                    <RattingStars rating={review.rating} />
                </div>
            </div>
            <p className="text-gray-300">{review.comment}</p>
        </div>
    );
};

export default ReviewCard;