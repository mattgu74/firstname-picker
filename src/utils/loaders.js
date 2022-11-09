import {Suspense} from 'react';

export function loading(component, fallback=null) {
    return <>
      <Suspense fallback={fallback ?? <div>Loading...</div>}>
        {component}
      </Suspense>
    </>;
};
