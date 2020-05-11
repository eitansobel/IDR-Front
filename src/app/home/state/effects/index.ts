import { EffectsModule } from '@ngrx/effects';
import { UpdateEffects } from './home.effects';

export const HomeEffectsModules = EffectsModule.forFeature([
    UpdateEffects
]);
