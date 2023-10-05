import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilePicturePipe } from './profilePicture/profilePicture.pipe';
import { ChatPersonSearchPipe } from './search/chat-person-search.pipe';
import { UserSearchPipe } from './search/user-search.pipe';
import { TruncatePipe } from './truncate/truncate.pipe';

@NgModule({
    imports: [ 
        CommonModule 
    ],
    declarations: [
        ProfilePicturePipe,
        ChatPersonSearchPipe,
        UserSearchPipe,
        TruncatePipe,
    ],
    exports: [
        ProfilePicturePipe,
        ChatPersonSearchPipe,
        UserSearchPipe,
        TruncatePipe,
    ]
})
export class PipesModule { }
