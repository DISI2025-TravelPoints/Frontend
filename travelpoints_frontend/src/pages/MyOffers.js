import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Stack,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import dayjs from "dayjs";
import { getMyOffers } from "../requests/WishlistRequests";
import { getAttractionById } from "../requests/AdminRequests";

import '../styles/MyOffers.css';
import Header from "../components/Header";

const MyOffers = () => {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        (async () => {
            const raw = await getMyOffers();
            const enriched = await Promise.all(
                raw.map(async (o) => {
                    try {
                        const attraction = await getAttractionById(o.attractionId);
                        return { ...o, attraction };
                    } catch (err) {
                        console.error("Could not fetch attraction", err);
                        return o;
                    }
                })
            );
            setOffers(enriched);
        })();
    }, []);

    return (
        <><Header className="header-dark-text"/>
        <Box px={{ xs: 2, md: 10 }} py={8} className="my-offers-root">

            <Typography variant="h3" fontWeight={600} mb={4} className="my-offers-title">
                My&nbsp;Offers
            </Typography>

            {offers.length === 0 ? (
                <Typography color="text.secondary">No offers available.</Typography>
            ) : (
                <Stack spacing={5}>
                    {offers.map((o) => (
                        <Card
                            key={o.id}
                            className="offer-card"
                        >
                            <CardContent className="offer-card-content">
                                <Typography className="offer-title">
                                    {o.title}
                                </Typography>

                                {o.attraction && (
                                    <Typography className="offer-attraction">
                                        {o.attraction.name}
                                    </Typography>
                                )}

                                <Typography className="offer-description">
                                    {o.description}
                                </Typography>

                                <Stack direction="row" spacing={1} alignItems="center" className="offer-validity">
                                    <CalendarMonthIcon fontSize="small" />
                                    <Typography variant="caption" color="text.secondary">
                                        Valid until {dayjs(o.validUntil).format("DD.MM.YYYY")}
                                    </Typography>
                                </Stack>
                            </CardContent>

                            {o.attraction && (
                                <CardMedia
                                    component="img"
                                    image={`https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${o.attraction.id}/cover.jpeg`}
                                    alt={o.attraction.name}
                                    sx={{
                                        width: '300px',
                                        height: '100%',
                                        objectFit: 'cover',
                                        flexShrink: 0
                                    }}
                                />

                            )}
                        </Card>
                    ))}
                </Stack>
            )}
        </Box>
            </>
    );
};

export default MyOffers;
