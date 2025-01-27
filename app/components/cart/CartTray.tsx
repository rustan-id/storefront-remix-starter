import * as React from "react"
import { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { CartContents } from "./CartContents"
import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import { Price } from '~/components/products/Price';
import { loader } from '~/root';
import { CartLoaderData } from '~/routes/active-order';
import { FetcherWithComponents } from '~/types';
import { CurrencyCode } from '~/generated/graphql';


export function CartTray({
                             activeOrderFetcher,
                             open,
                             onClose
                         }: { activeOrderFetcher: FetcherWithComponents<CartLoaderData>; open: boolean; onClose: (closed: boolean) => void; }) {

    const activeOrder = activeOrderFetcher.data?.activeOrder;
    const currencyCode = activeOrder?.currencyCode || CurrencyCode.Usd;

    const removeItem = (lineId: string) => {
        activeOrderFetcher.submit({
            action: 'removeItem',
            lineId,
        }, {
            method: 'post',
            action: '/active-order'
        });
    }
    const adjustOrderLine = (lineId: string, quantity: number) => {
        activeOrderFetcher.submit({
            action: 'adjustItem',
            lineId,
            quantity: quantity.toString(),
        }, {
            method: 'post',
            action: '/active-order'
        });
    }
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 overflow-hidden"
                onClose={onClose}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                    </Transition.Child>

                    <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-300 sm:duration-300"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-300 sm:duration-300"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <div className="w-screen max-w-md">
                                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                                    <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                                        <div className="flex items-start justify-between">
                                            <Dialog.Title className="text-lg font-medium text-gray-900">
                                                Shopping cart
                                            </Dialog.Title>
                                            <div className="ml-3 h-7 flex items-center">
                                                <button
                                                    type="button"
                                                    className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                                    onClick={() => onClose(false)}
                                                >
                                                    <span className="sr-only">Close panel</span>
                                                    <XIcon className="h-6 w-6" aria-hidden="true"/>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <CartContents
                                                orderLines={activeOrder?.lines ?? []}
                                                currencyCode={currencyCode!}
                                                editable={true}
                                                removeItem={removeItem}
                                                adjustOrderLine={adjustOrderLine}
                                            ></CartContents>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <p>Subtotal</p>
                                            <p>
                                                {currencyCode &&
                                                    <Price priceWithTax={activeOrder?.subTotalWithTax ?? 0}
                                                           currencyCode={currencyCode}/>}
                                            </p>
                                        </div>
                                        <p className="mt-0.5 text-sm text-gray-500">
                                            Shipping and taxes calculated at checkout.
                                        </p>
                                        <div className="mt-6">
                                            <Link to="/checkout"
                                                  className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Checkout
                                            </Link>
                                        </div>
                                        <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                                            <p>
                                                or{" "}
                                                <button
                                                    type="button"
                                                    className="text-indigo-600 font-medium hover:text-indigo-500"
                                                    onClick={() => onClose(false)}
                                                >
                                                    Continue Shopping
                                                    <span aria-hidden="true"> &rarr;</span>
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
