import { EffectsModule } from '@ngrx/effects';
import { MessageEffects } from './message.effects';

export const MessageEffectsModules = EffectsModule.forFeature([
    MessageEffects
]);
