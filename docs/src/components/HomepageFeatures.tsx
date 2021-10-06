/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Modular by design',
    image: 'img/modular.png',
    description: (
      <>
        Build multiple stores and let your bundler code split them automatically
      </>
    ),
  },
  {
    title: 'Tree Shakeable & Fully Typed',
    image: 'img/tree.png',
    description: <>Anything you don't use won't become part of your bundle</>,
  },
  {
    title: 'CLI',
    image: 'img/cli.png',
    description: <>A fast and efficient way to build up your stores</>,
  },
  {
    title: 'First Class Entities Support',
    image: 'img/entities.png',
    description: <>Simply and easily manage entities in your store</>,
  },
  {
    title: 'Requests Status & Cache',
    image: 'img/requests.png',
    description: (
      <>
        Monitor server requests and cache them, preventing redundant API calls
      </>
    ),
  },
  {
    title: 'Persist State',
    image: 'img/persist.png',
    description: (
      <>Persist the store's state, offering a seamless user experience</>
    ),
  },
  {
    title: 'State History',
    image: 'img/history.png',
    description: (
      <>Save the store's state history, for easy undo/redo functionality</>
    ),
  },
  {
    title: 'Pagination',
    image: 'img/pagination.png',
    description: <>Get built-in support for managing pagination in the app</>,
  },
  {
    title: 'Devtools',
    image: 'img/devtools.png',
    description: (
      <>
        Elf hooks into Redux devtools to give you an enhanced development
        experience
      </>
    ),
  },
];

function Feature({ title, image, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4 feature')}>
      <div className="text--center">
        <img className={styles.featureSvg} alt={title} src={image} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
