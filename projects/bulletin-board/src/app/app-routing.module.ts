import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { homeRoutes } from './home';
import { authRoutes } from './auth';
import { loadChildrenMiscellaneousModule } from '@src/app/feature/miscellaneous';
import { loadChildrenPostsModule } from '@src/app/feature/posts';

// https://stackoverflow.com/questions/34208745/angular-2-optional-route-parameter/56391974#56391974

// export function customMatcher(
//   segments: UrlSegment[],
//   group: UrlSegmentGroup,
//   route: Route
// ): UrlMatchResult | null {
//   const lookupTable: { [key: number]: UrlMatchResult } = {
//     1: {
//       consumed: segments,
//       posParams: {},
//     },
//     2: {
//       consumed: segments,
//       posParams: { id: segments[1] },
//     },
//   };

//   const length = segments.length;
//   const result =
//     segments[0]?.path === 'home' && length in lookupTable
//       ? lookupTable[length]
//       : null;

//   return result;
// }

const routes: Routes = [
  ...homeRoutes,
  ...authRoutes,
  ...loadChildrenPostsModule(),
  loadChildrenMiscellaneousModule(),
];

// options about runGuardsAndResolvers
// https://juristr.com/blog/2019/01/Explore-Angular-Routers-runGuardsAndResolvers/

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // useHash:true,
      onSameUrlNavigation: 'reload',
      // enableTracing: true,
      scrollPositionRestoration: 'top',
      initialNavigation: 'enabled',
      // preloadingStrategy: PreloadAllModules,
      anchorScrolling: 'enabled',
      scrollOffset: [0, 100], // [x, y]
      // runGuardsAndResolvers: 'paramsChange',,
      relativeLinkResolution: 'corrected',
    } as ExtraOptions),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
