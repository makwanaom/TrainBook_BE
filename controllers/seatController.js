const { getSeats, reserveSeats} = require('../models/seatModel');

const getSeatAvailability = async (req, res) => {
  try {
    const seats = await getSeats();
    res.send(seats);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch seat availability', error });
  }
};

const bookSeats = async (req, res) => {
  const { count } = req.body;
  const userId = req.user.id; // Extracted from JWT

  if (!count || count > 7) {
    return res.status(400).send({ message: 'You can book a maximum of 7 seats at a time.' });
  }

  try {
    const seatsPerRow = 7;
    const totalSeats = 80;

    // Fetch all unreserved seats
    const availableSeats = await getSeats();
    const availableSeatIndexes = availableSeats
      .filter((seat) => !seat.reserved)
      .map((seat) => seat.id - 1);

    // Algorithm to book seats
    const bookedSeats = [];
    let seatsToBook = Number(count);

    // Priority: Book in the same row
    for (let i = 0; i < totalSeats && seatsToBook > 0; i += seatsPerRow) {
      const rowSeats = availableSeatIndexes.filter(
        (seat) => seat >= i && seat < i + seatsPerRow
      );

      if (rowSeats.length >= seatsToBook) {
        bookedSeats.push(...rowSeats.slice(0, seatsToBook));
        seatsToBook = 0;
        break;
      }
    }

    // If not enough seats in one row, book adjacent rows
    if (seatsToBook > 0) {
      bookedSeats.push(...availableSeatIndexes.slice(0, seatsToBook));
      seatsToBook -= bookedSeats.length;
    }

    if (bookedSeats.length > 0) {
      // Reserve the seats
      const reservedSeats = await reserveSeats(bookedSeats, userId);
      res.status(200).send(reservedSeats);
    } else {
      res.status(400).send({ message: 'Not enough seats available' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Failed to book seats', error });
  }
};

module.exports = { getSeatAvailability, bookSeats};
