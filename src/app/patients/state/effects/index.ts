import { EffectsModule } from '@ngrx/effects';
import { PatientsEffects } from './patients.effects';

export const PatientsEffectsModules = EffectsModule.forFeature([
    PatientsEffects
]);
