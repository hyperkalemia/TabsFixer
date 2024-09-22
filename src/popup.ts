class TabsBoxHandler {
    private tabsBox: HTMLElement;
    private tabList: NodeListOf<HTMLElement>;
    private tabBar: HTMLElement;
    private tabsBoxTop: number = 0;
    private tabsBoxBottom: number = 0;

    private data: {
        target: HTMLElement | null;
        diffY: number;
        cloneName?: string;
    } = {
        target: null,
        diffY: 0,
    };

    constructor() {
        this.init();
    }

    private async init() {
        this.tabsBox = (await searchForElement('.tabs-box'))!;
        this.tabList = this.tabsBox.querySelectorAll('div');
        this.tabBar = this.tabsBox.querySelector('.tab-bar')!;

        this.tabList.forEach((el) => {
            el.addEventListener('mousedown', this.ev.down.bind(this));
        });
    }

    public util = {
        index: (el: HTMLElement): number => {
            const parent = el.parentElement;
            if (!parent) return -1;
            const siblings = Array.from(parent.children);
            return siblings.indexOf(el);
        },
        insertClone: (target: HTMLElement, insertIdx: number): string => {
            const cloneName = `TabItemClone_${Math.trunc(Math.random() * 10000)}`;
            const clone = target.cloneNode(true) as HTMLElement;
            const parent = target.parentElement;
            if (!parent) return '';

            clone.classList.add('hidden');
            clone.classList.add(cloneName);
            parent.children[insertIdx].insertAdjacentElement('afterend', clone);

            return cloneName;
        },
        swap: (target: HTMLElement): void => {
            const selfIdx = this.util.index(target);
            const cloneIdx = selfIdx + 1;
            const parent = target.parentElement;
            if (!parent) return;

            const siblings = parent.querySelectorAll(`:scope > *:not(.onGrab):not(.${this.data.cloneName})`);

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
                    this.util.toggle(target);
                    break;
                }
            }
        },
        toggle: (target: HTMLElement): void => {
            if (this.util.index(target) > this.util.index(this.tabBar) && !target.classList.contains("inactive")) {
                target.classList.add('inactive');
            } else if (this.util.index(target) < this.util.index(this.tabBar) && target.classList.contains("inactive")) {
                target.classList.remove('inactive');
            }
        },
        getCurrentOrder: (): TabClassesType[] => {
            const items = Array.from(this.tabsBox.children) as HTMLElement[];
            const currentOrder = items.map(item => 
                Array.from(item.classList).filter((className) => isTabClassesType(className))[0]);
            return currentOrder;
        },
        sortByOrder: async (order: TabClassesType[], save: boolean = true): Promise<void> => {
            const items = Array.from(this.tabsBox.children) as HTMLElement[];
            order.forEach(className => {
                const elem = items.find(item => item.classList.contains(className));
                if (elem instanceof HTMLElement) { this.tabsBox.appendChild(elem) }
            })
            items.forEach(item => {
                this.util.toggle(item as HTMLElement);
            });
            if (save) { await this.util.save(); }
        },
        save: async (): Promise<void> => {
            const currentOrder = this.util.getCurrentOrder();
            await setLocalValue("TabsArray", currentOrder);
            await chrome.runtime.sendMessage<RequestMessageType>({
                target: "background",
                key: "TabsArray",
                value: currentOrder
            });
        } 
    };

    private ev = {
        down: async (e: MouseEvent): Promise<void> => {
            if (this.data.target) { return }

            const target = e.target as HTMLElement;
            if (target === this.tabBar) { return }

            const tabsBoxRect = (await searchForElement('.tabs-box'))!.getBoundingClientRect();
            this.tabsBoxTop = tabsBoxRect.top;
            this.tabsBoxBottom = tabsBoxRect.bottom;

            const pageY = e.pageY;
            const rect = target.getBoundingClientRect();
            const style = window.getComputedStyle(target);
            const paddingLeft = parseFloat(style.paddingLeft);
            const targetW = rect.width - 2 * paddingLeft;
            const targetPosT = rect.top;

            this.data.target = target;
            this.data.diffY = pageY - rect.top;
            this.data.cloneName = this.util.insertClone(target, this.util.index(target));
            target.style.width = `${targetW}px`;
            target.style.top = `${targetPosT}px`;
            target.classList.add('onGrab');
            window.addEventListener('mousemove', this.ev.move.bind(this));
            window.addEventListener('mouseup', this.ev.up.bind(this));
        },
        move: (e: MouseEvent): void => {
            const target = this.data.target;
            if (!target) return;

            const pageY = e.pageY;
            const targetH = target.offsetHeight;
            const targetPosT = pageY - this.data.diffY;
            if (!(this.tabsBoxTop < targetPosT && targetPosT < this.tabsBoxBottom - targetH)) { return }

            target.style.top = `${targetPosT}px`;
            this.util.swap(target);
        },
        up: async (): Promise<void> => {
            const target = this.data.target;
            if (!target) return;

            const cloneSelector = `.${this.data.cloneName}`;
            const clone = document.querySelector(cloneSelector) as HTMLElement;

            if (clone) {
                clone.remove();
            }
            
            target.removeAttribute('style');
            target.classList.remove('onGrab');
            target.classList.remove('onDrag');
            window.removeEventListener('mousemove', this.ev.move.bind(this));
            window.removeEventListener('mouseup', this.ev.up.bind(this));
            this.data.target = null;

            this.util.save()
        }
    };
}

document.addEventListener('DOMContentLoaded', async function() {

    //initialize
    const tabsBoxHandler = new TabsBoxHandler();
    RequestKeys.forEach(async (key) => {
        const localValue: unknown = await getLocalValue(key);
        if (key === "TabsArray") {
            const tabsOrder = isTabClassesTypeArray(localValue) ? localValue : defaultTabsOrder
            tabsBoxHandler.util.sortByOrder(tabsOrder, false)
        }
    })
    
    const resetButton = await searchForElement(".reset");
    resetButton!.addEventListener('click', () => {
        tabsBoxHandler.util.sortByOrder(defaultTabsOrder);
    });

});