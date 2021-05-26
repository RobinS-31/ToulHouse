// == Import : npm
import mongoose from 'mongoose';


const { Schema } = mongoose;
const ApartmentSchema = new Schema({
    type: {
        type: Number,
        required: [true, 'Sélectionnez un type'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Ajoutez un titre'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Ajoutez une adresse'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Ajoutez un prix'],
        trim: true
    },
    cc: { type: Boolean },
    surface: {
        type: Number,
        required: [true, 'Ajoutez une superficie'],
        trim: true
    },
    pcsNbr: {
        type: Number,
        required: [true, 'Ajoutez un nombre de pièces'],
        trim: true
    },
    bedroomNbr: {
        type: Number,
        required: [true, 'Ajoutez un nombre de chambres'],
        trim: true
    },
    floor: { type: String },
    insideDetails: {
        type: Array,
        required: [true, `Ajoutez des détails sur l'intérieur`]
    },
    outsideDetails: {
        type: Array,
        required: [true, `Ajoutez des détails sur l'extérieur`]
    },
    images: {
        type: Array,
        required: [true, 'Ajoutez des images']
    }
});

let Apartment;
if (!mongoose?.models?.Apartment) {
    Apartment = mongoose.model('Apartment', ApartmentSchema);
} else {
    Apartment = mongoose.model('Apartment');
}
export default Apartment;
