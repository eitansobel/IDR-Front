import { EffectsModule } from '@ngrx/effects';
import { StaffEffects } from './staff.effects';

export const StaffEffectsModules = EffectsModule.forFeature([
    StaffEffects
]);
