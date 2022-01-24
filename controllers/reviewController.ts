export const submitReview = async (userId: string, itemId: string, review: string, stars: number, token: string, setShowModal: Function) => {
    const response = await fetch('/api/comedor/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            user: userId,
            dish: itemId,
            review,
            rating: stars
        })
    });
    const data = await response.json();
    if (!response.ok) console.log(data)
    setShowModal('hidden');
}

export const modifyReview = async (userId: string, reviewId: string, review: string, stars: number, token: string, setShowModal: Function) => {
    const response = await fetch('/api/comedor/reviews', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            user: userId,
            reviewId,
            review,
            rating: stars
        })
    });
    const data = await response.json();
    if (!response.ok) console.log(data)
    setShowModal('hidden');
}