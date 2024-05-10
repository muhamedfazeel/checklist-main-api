export const LoginQuery = `
    SELECT 
        u.id,
        u.name,
        u.email,
        u.image_url,
        u.type
    FROM users u
    WHERE u.email = $1;
`;

export const SetImageUrlQuery = `
    UPDATE users
    SET image_url = $1
    WHERE id = $2
    RETURNING *;
`;
