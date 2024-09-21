async function TabsBoxHandler() {

    const tabsBox = await searchForElement('.tabs-box') as HTMLElement;
    const tabsBoxRect = tabsBox.getBoundingClientRect();
    const tabsBoxTop = tabsBoxRect.top
    const tabsBoxBottom = tabsBoxRect.bottom
    
    const tabList = tabsBox.querySelectorAll('div');
    const tabBar = tabsBox.querySelector('.tab-bar') as HTMLElement;
    
    interface Data {
        target: HTMLElement | null;
        diffY: number;
        cloneName?: string;
    }

    const data: Data = {
        target: null,
        diffY: 0,
    };

    const util = {
        index(el: HTMLElement): number {
            const parent = el.parentElement;
            if (!parent) return -1;
            const siblings = Array.from(parent.children);
            return siblings.indexOf(el);
        },
        insertClone(target: HTMLElement, insertIdx: number): string {
            const cloneName = `TabItemClone_${Math.trunc(Math.random() * 10000)}`;
            const clone = target.cloneNode(true) as HTMLElement;
            const parent = target.parentElement;
            if (!parent) return '';

            clone.classList.add('hidden');
            clone.classList.add(cloneName);
            parent.children[insertIdx].insertAdjacentElement('afterend', clone);

            return cloneName;
        },
        swap(target: HTMLElement): void {
            const selfIdx = util.index(target);
            const cloneIdx = selfIdx + 1;
            const parent = target.parentElement;
            if (!parent) return;

            const siblings = parent.querySelectorAll(`:scope > *:not(.onGrab):not(.${data.cloneName})`);

            for (let thatIdx = 0; thatIdx < siblings.length; thatIdx++) {
                const targetH = target.offsetHeight;
                const targetRect = target.getBoundingClientRect();
                const targetRectY = targetRect.top;
                const that = siblings[thatIdx] as HTMLElement;
                const thatH = that.offsetHeight;
                const thatRect = that.getBoundingClientRect();
                const thatRectY = thatRect.top;
                const thatRectYHalf = thatRectY + (thatH / 2);
                
                const isHit = targetRectY <= thatRectYHalf && (targetRectY + targetH) >= thatRectYHalf;

                if (isHit) {
                    const siblingsAll = parent.children;
                    const clone = siblingsAll[cloneIdx];

                    parent.insertBefore(clone, selfIdx > thatIdx ? that : that.nextSibling);
                    parent.insertBefore(target, clone);
                    util.toggle(target);
                    break;
                }
            }
        },
        toggle(target: HTMLElement): void {
            if (util.index(target) > util.index(tabBar) && !target.classList.contains("inactive")) {
                target.classList.add('inactive');
            } else if (util.index(target) < util.index(tabBar) && target.classList.contains("inactive")) {
                target.classList.remove('inactive');
            }
        },
        sortByOrder(order: TabClassesType[]): void {
            const items = Array.from(tabsBox.children) as HTMLElement[];
            const sortedItems = order.map(className => 
                items.find(item => item.classList.contains(className))
            ).filter(Boolean) as HTMLElement[];

            sortedItems.forEach(item => {
                tabsBox.appendChild(item);
            });
            sortedItems.forEach(item => {
                util.toggle(item);
            });
        },
        getCurrentOrder(): TabClassesType[] {
            const items = Array.from(tabsBox.children) as HTMLElement[];
            const currentOrder = items.map(item => 
                Array.from(item.classList).filter((className) =>
                    isTabClassesType(className)
                ) as TabClassesType[] )[0];
            return currentOrder
        }
    };

    const ev = {
        down(e: MouseEvent): void {
            if (data.target) { return }

            const target = e.target as HTMLElement;
            if (target == tabBar) { return }

            const pageY = e.pageY;
            const rect = target.getBoundingClientRect();
            const style = window.getComputedStyle(target);
            const paddingLeft = parseFloat(style.paddingLeft);
            const targetW = rect.width - 2*paddingLeft;
            
            data.target = target;
            data.diffY = pageY - rect.top;
            data.cloneName = util.insertClone(target, util.index(target));
            target.style.width = `${targetW}px`;
            target.classList.add('onGrab');
            window.addEventListener('mousemove', ev.move);
            window.addEventListener('mouseup', ev.up);
        },
        move(e: MouseEvent): void {
            const target = data.target;
            if (!target) return;

            const pageY = e.pageY;
            const targetPosT = pageY - data.diffY;
            if (!(tabsBoxTop < targetPosT && targetPosT < tabsBoxBottom-target.offsetHeight)) { return }

            target.style.top = `${targetPosT}px`;
            util.swap(target);
        },
        async up(): Promise<void> {
            const target = data.target;
            if (!target) return;

            const cloneSelector = `.${data.cloneName}`;
            const clone = document.querySelector(cloneSelector) as HTMLElement;

            if (clone) {
                clone.remove();
            }
            
            target.removeAttribute('style');
            target.classList.remove('onGrab');
            target.classList.remove('onDrag');
            window.removeEventListener('mousemove', ev.move);
            window.removeEventListener('mouseup', ev.up);
            data.target = null;

            const currentOrder = util.getCurrentOrder();
            await sendRequestMessage("TabsArray", currentOrder)
            await chrome.storage.local.set( {"TabsArray": currentOrder} );
        }
    };

    tabList.forEach((el) => {
        el.addEventListener('mousedown', ev.down);
    });
};

async function sendRequestMessage(key: RequestKeysType, value: any) {
    chrome.runtime.sendMessage<RequestMessageType>({
        target: "background",
        key: key,
        value: value
    });
}

document.addEventListener('DOMContentLoaded', async function() {

    //initialize

    await TabsBoxHandler()

    const localStorage = await chrome.storage.local.get();
    const keyIds: string[] = [...RequestKeys];
    Object.keys(localStorage).forEach((key: string) => {
        if (keyIds.indexOf(key) !== -1) {
            if (keyIds.indexOf(key) == 0) {
                
            }
        }
    });
});